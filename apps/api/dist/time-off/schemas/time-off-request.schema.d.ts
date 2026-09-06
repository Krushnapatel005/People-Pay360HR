import { Document, Types } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';
import { TimeOffType, TimeOffUnit } from './time-off-type.schema';
import { Company } from '../../companies/schemas/company.schema';
import { LeaveAllocation } from './leave-allocation.schema';
import { User } from '../../users/schemas/user.schema';
export type TimeOffRequestDocument = TimeOffRequest & Document;
export declare enum RequestStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    WITHDRAWN = "WITHDRAWN"
}
export declare class ApprovalHistory {
    action: string;
    actorUserId: User | Types.ObjectId;
    comment?: string;
    createdAt: Date;
}
export declare const ApprovalHistorySchema: any;
export declare class TimeOffRequest {
    reference: string;
    employeeId: Employee | Types.ObjectId;
    timeOffTypeId: TimeOffType | Types.ObjectId;
    companyId: Company | Types.ObjectId;
    startDate: Date;
    endDate: Date;
    duration: number;
    unit: TimeOffUnit;
    status: RequestStatus;
    reason: string;
    attachmentUrls?: string[];
    approverIds?: User[] | Types.ObjectId[];
    approvalHistory: ApprovalHistory[];
    leaveAllocationId?: LeaveAllocation | Types.ObjectId;
}
export declare const TimeOffRequestSchema: any;
