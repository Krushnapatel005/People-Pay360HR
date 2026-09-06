import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
export type TimeOffTypeDocument = TimeOffType & Document;
export declare enum TimeOffUnit {
    DAYS = "DAYS",
    HOURS = "HOURS"
}
export declare class TimeOffType {
    name: string;
    code: string;
    companyId: Company | Types.ObjectId;
    color?: string;
    icon?: string;
    isPaid: boolean;
    requiresAllocation: boolean;
    requiresApproval: boolean;
    unit: TimeOffUnit;
    allowNegativeBalance: boolean;
    allowPartialDay: boolean;
    requiresAttachment: boolean;
    carryoverEnabled: boolean;
    maximumCarryover?: number;
    minimumNoticeDays?: number;
    maximumDuration?: number;
    isActive: boolean;
}
export declare const TimeOffTypeSchema: any;
