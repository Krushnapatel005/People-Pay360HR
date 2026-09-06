import { Document, Types } from 'mongoose';
import { SalaryStructure } from './salary-structure.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Employee } from '../../employees/schemas/employee.schema';
import { User } from '../../users/schemas/user.schema';
export type PayrunDocument = Payrun & Document;
export declare enum PayrunStatus {
    DRAFT = "DRAFT",
    COMPUTED = "COMPUTED",
    VALIDATED = "VALIDATED",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}
export declare class Payrun {
    reference: string;
    companyId: Company | Types.ObjectId;
    periodStart: Date;
    periodEnd: Date;
    payFrequency: string;
    salaryStructureId?: SalaryStructure | Types.ObjectId;
    selectedEmployeeIds: Employee[] | Types.ObjectId[];
    status: PayrunStatus;
    grossTotal: number;
    deductionTotal: number;
    netTotal: number;
    exceptionIds?: Types.ObjectId[];
    createdBy?: User | Types.ObjectId;
    computedBy?: User | Types.ObjectId;
    computedAt?: Date;
    validatedBy?: User | Types.ObjectId;
    validatedAt?: Date;
    paidBy?: User | Types.ObjectId;
    paidAt?: Date;
    paymentReference?: string;
    notes?: string;
}
export declare const PayrunSchema: any;
