import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  // Basic CRUD for Payrun
  async findPayruns() { return this.prisma.payrun.findMany({ include: { structure: true } }); }
  async createPayrun(data: any) { return this.prisma.payrun.create({ data }); }
  async findPayrun(id: string) { return this.prisma.payrun.findUnique({ where: { id }, include: { structure: true, payslips: { include: { employee: true } } } }); }
  async updatePayrun(id: string, data: any) { return this.prisma.payrun.update({ where: { id }, data }); }
  async deletePayrun(id: string) { return this.prisma.payrun.delete({ where: { id } }); }

  // Basic CRUD for Payslips
  async findPayslips() { return this.prisma.payslip.findMany({ include: { employee: true, payrun: true } }); }
  async createPayslip(data: any) { return this.prisma.payslip.create({ data }); }
  async findPayslip(id: string) { return this.prisma.payslip.findUnique({ where: { id }, include: { employee: true, payrun: true, lines: { orderBy: { sequence: 'asc' } } } }); }
  async updatePayslip(id: string, data: any) { return this.prisma.payslip.update({ where: { id }, data }); }
  async deletePayslip(id: string) { return this.prisma.payslip.delete({ where: { id } }); }

  // Basic CRUD for Salary Structures
  async findStructures() { return this.prisma.salaryStructure.findMany(); }
  async createStructure(data: any) { return this.prisma.salaryStructure.create({ data }); }
  async findStructure(id: string) { return this.prisma.salaryStructure.findUnique({ where: { id } }); }
  async updateStructure(id: string, data: any) { return this.prisma.salaryStructure.update({ where: { id }, data }); }
  async deleteStructure(id: string) { return this.prisma.salaryStructure.delete({ where: { id } }); }

  // Basic CRUD for Salary Rules
  async findRules() { return this.prisma.salaryRule.findMany({ orderBy: { sequence: 'asc' } }); }
  async createRule(data: any) { return this.prisma.salaryRule.create({ data }); }
  async findRule(id: string) { return this.prisma.salaryRule.findUnique({ where: { id } }); }
  async updateRule(id: string, data: any) { return this.prisma.salaryRule.update({ where: { id }, data }); }
  async deleteRule(id: string) { return this.prisma.salaryRule.delete({ where: { id } }); }

  // P1-22: Employee eligibility for Payrun
  async getEligibleEmployees(periodStart: string, periodEnd: string, structureId: string) {
    const pStart = new Date(periodStart);
    const pEnd = new Date(periodEnd);

    // Find all contracts active in this period and bound to this structure
    const validContracts = await this.prisma.contract.findMany({
      where: {
        salaryStructureId: structureId,
        startDate: { lte: pEnd },
        OR: [
          { endDate: null },
          { endDate: { gte: pStart } }
        ]
      },
      include: { employee: true }
    });

    return validContracts.map(c => c.employee);
  }

  // P1-25 & P1-19: Compute Payrun
  async computePayrun(payrunId: string, selectedEmployeeIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      const payrun = await tx.payrun.findUnique({ where: { id: payrunId }, include: { structure: { include: { rules: { orderBy: { sequence: 'asc' } } } } } });
      if (!payrun) throw new NotFoundException('Payrun not found');
      if (payrun.status !== 'DRAFT') throw new BadRequestException('Payrun must be in DRAFT to compute');

      const pStart = payrun.periodStart;
      const pEnd = payrun.periodEnd;
      let totalGross = 0;
      let totalDeduction = 0;
      let totalNet = 0;

      for (const empId of selectedEmployeeIds) {
        // P1-23: Prevent Duplicate Payslips
        const existing = await tx.payslip.findFirst({
          where: { employeeId: empId, periodStart: pStart, periodEnd: pEnd }
        });
        if (existing) {
          throw new ConflictException(`Duplicate payslip detected for employee ${empId}`);
        }

        const contract = await tx.contract.findFirst({
          where: { employeeId: empId, startDate: { lte: pEnd }, OR: [{ endDate: null }, { endDate: { gte: pStart } }] }
        });
        
        if (!contract) {
          throw new BadRequestException(`No active contract found for employee ${empId}`);
        }

        const baseSalary = Number(contract.wageAmount);
        let gross = 0;
        let deductions = 0;

        const generatedLines: any[] = [];
        
        // Dynamic formula sandbox (simplified for P1 MVP)
        const context: Record<string, number> = { BASIC: baseSalary };

        if (payrun.structure?.rules) {
          for (const rule of payrun.structure.rules) {
            let ruleAmount = 0;

            if (rule.calculationMethod === 'FIXED' && rule.amount) {
              ruleAmount = Number(rule.amount);
            } else if (rule.calculationMethod === 'PERCENTAGE' && rule.percentage) {
               // Evaluate against base rule or just basic
               ruleAmount = (Number(rule.percentage) / 100) * baseSalary; 
            } else if (rule.formula) {
              // Safe expression evaluation
              let expr = rule.formula;
              for (const [key, value] of Object.entries(context)) {
                expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
              }
              
              if (/^[0-9+\-*/().\s]+$/.test(expr)) {
                try {
                  // eslint-disable-next-line @typescript-eslint/no-implied-eval
                  ruleAmount = new Function('return ' + expr)();
                } catch {
                  ruleAmount = 0;
                }
              } else {
                ruleAmount = 0; // Or throw error, but 0 is safer for payroll flow continuation
              }
            }

            if (rule.category === 'BASIC_SALARY') gross += ruleAmount;
            if (rule.category === 'ALLOWANCE') gross += ruleAmount;
            if (rule.category === 'DEDUCTION') deductions += ruleAmount;
            
            context[rule.code] = ruleAmount;

            generatedLines.push({
              ruleCode: rule.code,
              ruleName: rule.name,
              category: rule.category,
              amount: ruleAmount,
              sequence: rule.sequence
            });
          }
        }

        const net = gross - deductions;
        
        totalGross += gross;
        totalDeduction += deductions;
        totalNet += net;

        await tx.payslip.create({
          data: {
            reference: `PS-${Date.now()}-${empId.slice(-4)}`,
            payrunId: payrun.id,
            employeeId: empId,
            contractId: contract.id,
            periodStart: pStart,
            periodEnd: pEnd,
            grossPay: gross,
            netPay: net,
            status: 'COMPUTED',
            lines: {
              create: generatedLines
            }
          }
        });
      }

      return tx.payrun.update({
        where: { id: payrunId },
        data: {
          status: 'COMPUTED',
          grossTotal: totalGross,
          deductionTotal: totalDeduction,
          netTotal: totalNet,
          structureSnapshot: payrun.structure as any
        }
      });
    });
  }

  // P1-26: Validation
  async validatePayrun(id: string) {
    const payrun = await this.prisma.payrun.findUnique({ where: { id }, include: { payslips: true } });
    if (!payrun) throw new NotFoundException('Payrun not found');
    if (payrun.status !== 'COMPUTED') {
      throw new BadRequestException('Payrun must be COMPUTED before validation');
    }
    
    // Simulate validation logic (e.g. looking for warnings)
    if (payrun.payslips.length === 0) {
      throw new BadRequestException('Critical Warning: No payslips found in payrun');
    }

    return this.prisma.payrun.update({
      where: { id },
      data: { status: 'VALIDATED' }
    });
  }

  // P1-27: Mark Paid
  async markPaid(id: string) {
    const payrun = await this.prisma.payrun.findUnique({ where: { id } });
    if (!payrun) throw new NotFoundException('Payrun not found');
    if (payrun.status !== 'VALIDATED') {
       throw new BadRequestException('Payrun must be VALIDATED before marking paid');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payslip.updateMany({
        where: { payrunId: id },
        data: { status: 'PAID' }
      });
      return tx.payrun.update({
        where: { id },
        data: { status: 'PAID', paidAt: new Date() }
      });
    });
  }
}
