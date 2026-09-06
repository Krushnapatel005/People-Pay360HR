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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    transporter;
    logger = new common_1.Logger(EmailService_1.name);
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendPayslipEmail(employeeEmail, employeeName, periodString, pdfBuffer) {
        if (!process.env.SMTP_USER) {
            this.logger.warn(`SMTP not configured. Mock sending payslip to ${employeeEmail} for ${periodString}`);
            return;
        }
        try {
            const info = await this.transporter.sendMail({
                from: '"PeoplePay360 Payroll" <payroll@peoplepay360.local>',
                to: employeeEmail,
                subject: `Your Payslip for ${periodString}`,
                text: `Dear ${employeeName},\n\nPlease find attached your payslip for ${periodString}.\n\nBest regards,\nPeoplePay360 Team`,
                html: `<p>Dear ${employeeName},</p><p>Please find attached your payslip for <strong>${periodString}</strong>.</p><p>Best regards,<br/>PeoplePay360 Team</p>`,
                attachments: [
                    {
                        filename: `Payslip_${periodString.replace(/\s+/g, '_')}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    }
                ]
            });
            this.logger.log(`Payslip email sent to ${employeeEmail}: ${info.messageId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send payslip to ${employeeEmail}`, error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map