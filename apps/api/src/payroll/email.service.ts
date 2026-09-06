import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // In production, configure this via ConfigService/ENV variables
    // For local dev, we will use Ethereal Mail (mock SMTP) or a safe local config
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPayslipEmail(employeeEmail: string, employeeName: string, periodString: string, pdfBuffer: Buffer) {
    // If auth is not configured, just log to console (avoids crashing local dev without SMTP)
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
    } catch (error) {
      this.logger.error(`Failed to send payslip to ${employeeEmail}`, error);
      throw error;
    }
  }
}
