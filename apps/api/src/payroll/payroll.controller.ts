import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Res, ConflictException } from '@nestjs/common';
import { Response } from 'express';
import { PayrollService } from './payroll.service';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('payroll')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService
  ) {}

  // Payruns
  @Get('payruns')
  @Permissions('payroll.read')
  findPayruns() { return this.payrollService.findPayruns(); }

  @Post('payruns')
  @Permissions('payroll.create_payrun')
  createPayrun(@Body() data: any) { return this.payrollService.createPayrun(data); }

  @Get('payruns/:id')
  @Permissions('payroll.read')
  findPayrun(@Param('id') id: string) { return this.payrollService.findPayrun(id); }

  @Patch('payruns/:id')
  @Permissions('payroll.compute')
  updatePayrun(@Param('id') id: string, @Body() data: any) { return this.payrollService.updatePayrun(id, data); }

  @Post('payruns/:id/compute')
  @Permissions('payroll.compute')
  computePayrun(@Param('id') id: string, @Body('employeeIds') employeeIds: string[]) {
    return this.payrollService.computePayrun(id, employeeIds || []);
  }

  @Post('payruns/:id/validate')
  @Permissions('payroll.validate')
  validatePayrun(@Param('id') id: string) {
    return this.payrollService.validatePayrun(id);
  }

  @Post('payruns/:id/mark-paid')
  @Permissions('payroll.publish_payslips')
  markPaid(@Param('id') id: string) {
    return this.payrollService.markPaid(id);
  }

  @Delete('payruns/:id')
  @Permissions('payroll.delete_payrun')
  deletePayrun(@Param('id') id: string) { return this.payrollService.deletePayrun(id); }

  // Payslips
  @Get('payslips')
  @Permissions('payroll.read')
  findPayslips() { return this.payrollService.findPayslips(); }

  @Post('payslips')
  @Permissions('payroll.publish_payslips')
  createPayslip(@Body() data: any) { return this.payrollService.createPayslip(data); }

  @Get('payslips/:id')
  @Permissions('payroll.read')
  findPayslip(@Param('id') id: string) { return this.payrollService.findPayslip(id); }

  @Patch('payslips/:id')
  @Permissions('payroll.publish_payslips')
  updatePayslip(@Param('id') id: string, @Body() data: any) { return this.payrollService.updatePayslip(id, data); }

  @Delete('payslips/:id')
  @Permissions('payroll.delete_payslips')
  deletePayslip(@Param('id') id: string) { return this.payrollService.deletePayslip(id); }

  @Get('payslips/:id/pdf')
  @Permissions('payroll.read')
  async getPayslipPdf(@Param('id') id: string, @Res() res: Response) {
    const payslip = await this.payrollService.findPayslip(id);
    if (!payslip) throw new ConflictException('Payslip not found');
    
    // In a real app we fetch employee from payslip.employeeId
    const employee = { firstName: 'Employee', lastName: '', department: 'General', position: 'Staff' }; 
    const buffer = await this.pdfService.generatePayslipPdf(payslip, employee);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="payslip-${payslip.reference}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post('payslips/:id/send')
  @Permissions('payroll.publish_payslips')
  async sendPayslipEmail(@Param('id') id: string) {
    const payslip = await this.payrollService.findPayslip(id);
    if (!payslip) throw new ConflictException('Payslip not found');
    if (payslip.status !== 'PAID') throw new ConflictException('Can only send PAID payslips');
    
    const employee = { firstName: 'Employee', lastName: '', email: 'employee@peoplepay360.local' };
    const buffer = await this.pdfService.generatePayslipPdf(payslip, employee);
    
    await this.emailService.sendPayslipEmail(employee.email, employee.firstName, payslip.reference || 'Unknown Period', buffer);
    return { success: true, message: 'Email sent successfully' };
  }

  // Salary Structures
  @Get('salary-structures')
  @Permissions('payroll.manage_salary_structures')
  findStructures() { return this.payrollService.findStructures(); }

  @Post('salary-structures')
  @Permissions('payroll.manage_salary_structures')
  createStructure(@Body() data: any) { return this.payrollService.createStructure(data); }

  @Get('salary-structures/:id')
  @Permissions('payroll.manage_salary_structures')
  findStructure(@Param('id') id: string) { return this.payrollService.findStructure(id); }

  @Patch('salary-structures/:id')
  @Permissions('payroll.manage_salary_structures')
  updateStructure(@Param('id') id: string, @Body() data: any) { return this.payrollService.updateStructure(id, data); }

  @Delete('salary-structures/:id')
  @Permissions('payroll.manage_salary_structures')
  deleteStructure(@Param('id') id: string) { return this.payrollService.deleteStructure(id); }

  // Salary Rules
  @Get('salary-rules')
  @Permissions('payroll.manage_salary_rules')
  findRules() { return this.payrollService.findRules(); }

  @Post('salary-rules')
  @Permissions('payroll.manage_salary_rules')
  createRule(@Body() data: any) { return this.payrollService.createRule(data); }

  @Get('salary-rules/:id')
  @Permissions('payroll.manage_salary_rules')
  findRule(@Param('id') id: string) { return this.payrollService.findRule(id); }

  @Patch('salary-rules/:id')
  @Permissions('payroll.manage_salary_rules')
  updateRule(@Param('id') id: string, @Body() data: any) { return this.payrollService.updateRule(id, data); }

  @Delete('salary-rules/:id')
  @Permissions('payroll.manage_salary_rules')
  deleteRule(@Param('id') id: string) { return this.payrollService.deleteRule(id); }
}
