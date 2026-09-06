import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
export type SalaryRuleDocument = SalaryRule & Document;
export declare enum RuleCategory {
    BASIC_SALARY = "BASIC_SALARY",
    ALLOWANCE = "ALLOWANCE",
    DEDUCTION = "DEDUCTION",
    TAX = "TAX",
    EMPLOYER_CONTRIBUTION = "EMPLOYER_CONTRIBUTION",
    GROSS = "GROSS",
    NET = "NET"
}
export declare enum CalculationMethod {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE",
    FORMULA = "FORMULA",
    CONDITIONAL = "CONDITIONAL"
}
export declare class SalaryRule {
    name: string;
    code: string;
    companyId: Company | Types.ObjectId;
    category: RuleCategory;
    calculationMethod: CalculationMethod;
    fixedAmount?: number;
    percentage?: number;
    formula?: string;
    baseRuleId?: SalaryRule | Types.ObjectId;
    sequence: number;
    conditions?: Record<string, any>;
    dependencyRuleIds?: SalaryRule[] | Types.ObjectId[];
    isActive: boolean;
}
export declare const SalaryRuleSchema: any;
