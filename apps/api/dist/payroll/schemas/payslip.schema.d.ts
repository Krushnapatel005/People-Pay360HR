import { Document, Types } from 'mongoose';
import { Payrun } from './payrun.schema';
import { Employee } from '../../employees/schemas/employee.schema';
export type PayslipDocument = Payslip & Document;
export declare enum PayslipStatus {
    DRAFT = "DRAFT",
    GENERATED = "GENERATED",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare enum EmailDeliveryStatus {
    NOT_SENT = "NOT_SENT",
    QUEUED = "QUEUED",
    SENT = "SENT",
    FAILED = "FAILED"
}
export declare class Payslip {
    reference: string;
    payrunId: Payrun | Types.ObjectId;
    employeeId: Employee | Types.ObjectId;
    contractSnapshot?: Record<string, any>;
    salaryStructureSnapshot?: Record<string, any>;
    salaryRuleSnapshots?: Record<string, any>[];
    companySnapshot?: Record<string, any>;
    periodStart: Date;
    periodEnd: Date;
    earnings: Array<{
        name: string;
        amount: number;
    }>;
    deductions: Array<{
        name: string;
        amount: number;
    }>;
    employerContributions?: Array<{
        name: string;
        amount: number;
    }>;
    grossPay: number;
    netPay: number;
    status: PayslipStatus;
    pdfUrl?: string;
    emailDeliveryStatus: EmailDeliveryStatus;
    publishedAt?: Date;
    sentAt?: Date;
}
export declare const PayslipSchema: any;
