import { Document, Types } from 'mongoose';
import { Employee } from '../../employees/schemas/employee.schema';
import { TimeOffType } from './time-off-type.schema';
import { Company } from '../../companies/schemas/company.schema';
import { User } from '../../users/schemas/user.schema';
export type LeaveAllocationDocument = LeaveAllocation & Document;
export declare enum AllocationStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare class LeaveAdjustment {
    amount: number;
    reason: string;
    adjustedBy: User | Types.ObjectId;
    adjustedAt: Date;
}
export declare const LeaveAdjustmentSchema: any;
export declare class LeaveAllocation {
    employeeId: Employee | Types.ObjectId;
    timeOffTypeId: TimeOffType | Types.ObjectId;
    companyId: Company | Types.ObjectId;
    validFrom: Date;
    validTo: Date;
    allocatedAmount: number;
    usedAmount: number;
    pendingAmount: number;
    remainingAmount: number;
    carryoverAmount: number;
    status: AllocationStatus;
    adjustments: LeaveAdjustment[];
}
export declare const LeaveAllocationSchema: any;
