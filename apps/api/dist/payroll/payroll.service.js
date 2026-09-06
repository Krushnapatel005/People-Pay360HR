"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PayrollService = class PayrollService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPayruns() { return this.prisma.payrun.findMany({ include: { structure: true } }); }
    async createPayrun(data) { return this.prisma.payrun.create({ data }); }
    async findPayrun(id) { return this.prisma.payrun.findUnique({ where: { id }, include: { structure: true, payslips: { include: { employee: true } } } }); }
    async updatePayrun(id, data) { return this.prisma.payrun.update({ where: { id }, data }); }
    async deletePayrun(id) { return this.prisma.payrun.delete({ where: { id } }); }
    async findPayslips() { return this.prisma.payslip.findMany({ include: { employee: true, payrun: true } }); }
    async createPayslip(data) { return this.prisma.payslip.create({ data }); }
    async findPayslip(id) { return this.prisma.payslip.findUnique({ where: { id }, include: { employee: true, payrun: true, lines: { orderBy: { sequence: 'asc' } } } }); }
    async updatePayslip(id, data) { return this.prisma.payslip.update({ where: { id }, data }); }
    async deletePayslip(id) { return this.prisma.payslip.delete({ where: { id } }); }
    async findStructures() { return this.prisma.salaryStructure.findMany(); }
    async createStructure(data) { return this.prisma.salaryStructure.create({ data }); }
    async findStructure(id) { return this.prisma.salaryStructure.findUnique({ where: { id } }); }
    async updateStructure(id, data) { return this.prisma.salaryStructure.update({ where: { id }, data }); }
    async deleteStructure(id) { return this.prisma.salaryStructure.delete({ where: { id } }); }
    async findRules() { return this.prisma.salaryRule.findMany({ orderBy: { sequence: 'asc' } }); }
    async createRule(data) { return this.prisma.salaryRule.create({ data }); }
    async findRule(id) { return this.prisma.salaryRule.findUnique({ where: { id } }); }
    async updateRule(id, data) { return this.prisma.salaryRule.update({ where: { id }, data }); }
    async deleteRule(id) { return this.prisma.salaryRule.delete({ where: { id } }); }
    async getEligibleEmployees(periodStart, periodEnd, structureId) {
        const pStart = new Date(periodStart);
        const pEnd = new Date(periodEnd);
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
    async computePayrun(payrunId, selectedEmployeeIds) {
        return this.prisma.$transaction(async (tx) => {
            const payrun = await tx.payrun.findUnique({ where: { id: payrunId }, include: { structure: { include: { rules: { orderBy: { sequence: 'asc' } } } } } });
            if (!payrun)
                throw new common_1.NotFoundException('Payrun not found');
            if (payrun.status !== 'DRAFT')
                throw new common_1.BadRequestException('Payrun must be in DRAFT to compute');
            const pStart = payrun.periodStart;
            const pEnd = payrun.periodEnd;
            let totalGross = 0;
            let totalDeduction = 0;
            let totalNet = 0;
            for (const empId of selectedEmployeeIds) {
                const existing = await tx.payslip.findFirst({
                    where: { employeeId: empId, periodStart: pStart, periodEnd: pEnd }
                });
                if (existing) {
                    throw new common_1.ConflictException(`Duplicate payslip detected for employee ${empId}`);
                }
                const contract = await tx.contract.findFirst({
                    where: { employeeId: empId, startDate: { lte: pEnd }, OR: [{ endDate: null }, { endDate: { gte: pStart } }] }
                });
                if (!contract) {
                    throw new common_1.BadRequestException(`No active contract found for employee ${empId}`);
                }
                const baseSalary = Number(contract.wageAmount);
                let gross = 0;
                let deductions = 0;
                const generatedLines = [];
                const context = { BASIC: baseSalary };
                if (payrun.structure?.rules) {
                    for (const rule of payrun.structure.rules) {
                        let ruleAmount = 0;
                        if (rule.calculationMethod === 'FIXED' && rule.amount) {
                            ruleAmount = Number(rule.amount);
                        }
                        else if (rule.calculationMethod === 'PERCENTAGE' && rule.percentage) {
                            ruleAmount = (Number(rule.percentage) / 100) * baseSalary;
                        }
                        else if (rule.formula) {
                            let expr = rule.formula;
                            for (const [key, value] of Object.entries(context)) {
                                expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
                            }
                            if (/^[0-9+\-*/().\s]+$/.test(expr)) {
                                try {
                                    ruleAmount = new Function('return ' + expr)();
                                }
                                catch {
                                    ruleAmount = 0;
                                }
                            }
                            else {
                                ruleAmount = 0;
                            }
                        }
                        if (rule.category === 'BASIC_SALARY')
                            gross += ruleAmount;
                        if (rule.category === 'ALLOWANCE')
                            gross += ruleAmount;
                        if (rule.category === 'DEDUCTION')
                            deductions += ruleAmount;
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
                    structureSnapshot: payrun.structure
                }
            });
        });
    }
    async validatePayrun(id) {
        const payrun = await this.prisma.payrun.findUnique({ where: { id }, include: { payslips: true } });
        if (!payrun)
            throw new common_1.NotFoundException('Payrun not found');
        if (payrun.status !== 'COMPUTED') {
            throw new common_1.BadRequestException('Payrun must be COMPUTED before validation');
        }
        if (payrun.payslips.length === 0) {
            throw new common_1.BadRequestException('Critical Warning: No payslips found in payrun');
        }
        return this.prisma.payrun.update({
            where: { id },
            data: { status: 'VALIDATED' }
        });
    }
    async markPaid(id) {
        const payrun = await this.prisma.payrun.findUnique({ where: { id } });
        if (!payrun)
            throw new common_1.NotFoundException('Payrun not found');
        if (payrun.status !== 'VALIDATED') {
            throw new common_1.BadRequestException('Payrun must be VALIDATED before marking paid');
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
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map