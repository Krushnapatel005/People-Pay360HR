import { Document, Types } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';
import { Attendance } from './attendance.schema';
import { User } from '../../users/schemas/user.schema';
export type AttendanceCorrectionRequestDocument = AttendanceCorrectionRequest & Document;
export declare enum CorrectionRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class AttendanceCorrectionRequest {
    attendanceRecordId: Attendance | Types.ObjectId;
    employeeId: Employee | Types.ObjectId;
    requestedCheckIn?: Date;
    requestedCheckOut?: Date;
    reason: string;
    attachmentUrls?: string[];
    status: CorrectionRequestStatus;
    reviewedBy?: User | Types.ObjectId;
    reviewedAt?: Date;
    reviewReason?: string;
}
export declare const AttendanceCorrectionRequestSchema: any;
