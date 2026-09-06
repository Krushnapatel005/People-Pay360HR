import { Document, Types } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';
import { Company } from '../../companies/schemas/company.schema';
import { WorkingSchedule } from '../../working-schedules/schemas/working-schedule.schema';
export type AttendanceDocument = Attendance & Document;
export declare enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    LATE = "LATE",
    INCOMPLETE = "INCOMPLETE",
    ON_LEAVE = "ON_LEAVE",
    HOLIDAY = "HOLIDAY"
}
export declare enum AttendanceSource {
    SELF_SERVICE = "SELF_SERVICE",
    HR_MANUAL = "HR_MANUAL",
    IMPORT = "IMPORT",
    SYSTEM = "SYSTEM"
}
export declare enum CorrectionStatus {
    NONE = "NONE",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class Attendance {
    employeeId: Employee | Types.ObjectId;
    companyId: Company | Types.ObjectId;
    scheduleId?: WorkingSchedule | Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    breakMinutes?: number;
    totalMinutes?: number;
    scheduledMinutes?: number;
    varianceMinutes?: number;
    status: AttendanceStatus;
    source: AttendanceSource;
    notes?: string;
    correctionStatus: CorrectionStatus;
    isLocked: boolean;
}
export declare const AttendanceSchema: any;
