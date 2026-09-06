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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const pdf_service_1 = require("./pdf.service");
const email_service_1 = require("./email.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let PayrollController = class PayrollController {
    payrollService;
    pdfService;
    emailService;
    constructor(payrollService, pdfService, emailService) {
        this.payrollService = payrollService;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }
    findPayruns() { return this.payrollService.findPayruns(); }
    createPayrun(data) { return this.payrollService.createPayrun(data); }
    findPayrun(id) { return this.payrollService.findPayrun(id); }
    updatePayrun(id, data) { return this.payrollService.updatePayrun(id, data); }
    computePayrun(id, employeeIds) {
        return this.payrollService.computePayrun(id, employeeIds || []);
    }
    validatePayrun(id) {
        return this.payrollService.validatePayrun(id);
    }
    markPaid(id) {
        return this.payrollService.markPaid(id);
    }
    deletePayrun(id) { return this.payrollService.deletePayrun(id); }
    findPayslips() { return this.payrollService.findPayslips(); }
    createPayslip(data) { return this.payrollService.createPayslip(data); }
    findPayslip(id) { return this.payrollService.findPayslip(id); }
    updatePayslip(id, data) { return this.payrollService.updatePayslip(id, data); }
    deletePayslip(id) { return this.payrollService.deletePayslip(id); }
    async getPayslipPdf(id, res) {
        const payslip = await this.payrollService.findPayslip(id);
        if (!payslip)
            throw new common_1.ConflictException('Payslip not found');
        const employee = { firstName: 'Employee', lastName: '', department: 'General', position: 'Staff' };
        const buffer = await this.pdfService.generatePayslipPdf(payslip, employee);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="payslip-${payslip.reference}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async sendPayslipEmail(id) {
        const payslip = await this.payrollService.findPayslip(id);
        if (!payslip)
            throw new common_1.ConflictException('Payslip not found');
        if (payslip.status !== 'PAID')
            throw new common_1.ConflictException('Can only send PAID payslips');
        const employee = { firstName: 'Employee', lastName: '', email: 'employee@peoplepay360.local' };
        const buffer = await this.pdfService.generatePayslipPdf(payslip, employee);
        await this.emailService.sendPayslipEmail(employee.email, employee.firstName, payslip.reference || 'Unknown Period', buffer);
        return { success: true, message: 'Email sent successfully' };
    }
    findStructures() { return this.payrollService.findStructures(); }
    createStructure(data) { return this.payrollService.createStructure(data); }
    findStructure(id) { return this.payrollService.findStructure(id); }
    updateStructure(id, data) { return this.payrollService.updateStructure(id, data); }
    deleteStructure(id) { return this.payrollService.deleteStructure(id); }
    findRules() { return this.payrollService.findRules(); }
    createRule(data) { return this.payrollService.createRule(data); }
    findRule(id) { return this.payrollService.findRule(id); }
    updateRule(id, data) { return this.payrollService.updateRule(id, data); }
    deleteRule(id) { return this.payrollService.deleteRule(id); }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)('payruns'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findPayruns", null);
__decorate([
    (0, common_1.Post)('payruns'),
    (0, permissions_decorator_1.Permissions)('payroll.create_payrun'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createPayrun", null);
__decorate([
    (0, common_1.Get)('payruns/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findPayrun", null);
__decorate([
    (0, common_1.Patch)('payruns/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.compute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updatePayrun", null);
__decorate([
    (0, common_1.Post)('payruns/:id/compute'),
    (0, permissions_decorator_1.Permissions)('payroll.compute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('employeeIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "computePayrun", null);
__decorate([
    (0, common_1.Post)('payruns/:id/validate'),
    (0, permissions_decorator_1.Permissions)('payroll.validate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "validatePayrun", null);
__decorate([
    (0, common_1.Post)('payruns/:id/mark-paid'),
    (0, permissions_decorator_1.Permissions)('payroll.publish_payslips'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Delete)('payruns/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.delete_payrun'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "deletePayrun", null);
__decorate([
    (0, common_1.Get)('payslips'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findPayslips", null);
__decorate([
    (0, common_1.Post)('payslips'),
    (0, permissions_decorator_1.Permissions)('payroll.publish_payslips'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createPayslip", null);
__decorate([
    (0, common_1.Get)('payslips/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findPayslip", null);
__decorate([
    (0, common_1.Patch)('payslips/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.publish_payslips'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updatePayslip", null);
__decorate([
    (0, common_1.Delete)('payslips/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.delete_payslips'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "deletePayslip", null);
__decorate([
    (0, common_1.Get)('payslips/:id/pdf'),
    (0, permissions_decorator_1.Permissions)('payroll.read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayslipPdf", null);
__decorate([
    (0, common_1.Post)('payslips/:id/send'),
    (0, permissions_decorator_1.Permissions)('payroll.publish_payslips'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "sendPayslipEmail", null);
__decorate([
    (0, common_1.Get)('salary-structures'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_structures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findStructures", null);
__decorate([
    (0, common_1.Post)('salary-structures'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_structures'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createStructure", null);
__decorate([
    (0, common_1.Get)('salary-structures/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_structures'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findStructure", null);
__decorate([
    (0, common_1.Patch)('salary-structures/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_structures'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateStructure", null);
__decorate([
    (0, common_1.Delete)('salary-structures/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_structures'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "deleteStructure", null);
__decorate([
    (0, common_1.Get)('salary-rules'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_rules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findRules", null);
__decorate([
    (0, common_1.Post)('salary-rules'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_rules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createRule", null);
__decorate([
    (0, common_1.Get)('salary-rules/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_rules'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "findRule", null);
__decorate([
    (0, common_1.Patch)('salary-rules/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_rules'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateRule", null);
__decorate([
    (0, common_1.Delete)('salary-rules/:id'),
    (0, permissions_decorator_1.Permissions)('payroll.manage_salary_rules'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "deleteRule", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService,
        pdf_service_1.PdfService,
        email_service_1.EmailService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map