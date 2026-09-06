import { Document, Types } from 'mongoose';
import { SalaryRule } from './salary-rule.schema';
import { Company } from '../../companies/schemas/company.schema';
export type SalaryStructureDocument = SalaryStructure & Document;
export declare enum StructureStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED"
}
export declare class SalaryStructure {
    name: string;
    code: string;
    companyId: Company | Types.ObjectId;
    payFrequency: string;
    description?: string;
    ruleIds: SalaryRule[] | Types.ObjectId[];
    status: StructureStatus;
    version: number;
    effectiveFrom?: Date;
    effectiveTo?: Date;
}
export declare const SalaryStructureSchema: any;
