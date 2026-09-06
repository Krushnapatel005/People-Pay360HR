import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
export type WorkingScheduleDocument = WorkingSchedule & Document;
export declare enum ScheduleType {
    FIXED = "FIXED",
    FLEXIBLE = "FLEXIBLE",
    SHIFT = "SHIFT"
}
export declare class WorkDay {
    dayOfWeek: number;
    isWorkingDay: boolean;
    startTime?: string;
    endTime?: string;
    breakMinutes?: number;
}
export declare const WorkDaySchema: any;
export declare class WorkingSchedule {
    name: string;
    code: string;
    companyId: Company | Types.ObjectId;
    type: ScheduleType;
    timezone: string;
    weeklyHours: number;
    workDays: WorkDay[];
    breakMinutes?: number;
    flexibleTimeEnabled: boolean;
    shiftEnabled: boolean;
    isActive: boolean;
}
export declare const WorkingScheduleSchema: any;
