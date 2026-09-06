import { Document, Types } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Department } from '../../departments/schemas/department.schema';
import { SalaryStructure } from '../../payroll/schemas/salary-structure.schema';
import { WorkingSchedule } from '../../working-schedules/schemas/working-schedule.schema';
export type ContractDocument = Contract & Document;
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ENDED = "ENDED",
    CANCELLED = "CANCELLED"
}
export declare enum PayFrequency {
    MONTHLY = "MONTHLY",
    BIWEEKLY = "BIWEEKLY",
    WEEKLY = "WEEKLY",
    HOURLY = "HOURLY"
}
export declare class Contract {
    reference: string;
    employeeId: Employee | Types.ObjectId;
    companyId: Company | Types.ObjectId;
    departmentId?: Department | Types.ObjectId;
    contractType: string;
    jobTitle: string;
    startDate: Date;
    endDate?: Date;
    probationEndDate?: Date;
    status: ContractStatus;
    wageAmount: number;
    currency: string;
    payFrequency: PayFrequency;
    salaryStructureId?: SalaryStructure | Types.ObjectId;
    scheduleId?: WorkingSchedule | Types.ObjectId;
    notes?: string;
    isActive: boolean;
}
export declare const ContractSchema: any;
