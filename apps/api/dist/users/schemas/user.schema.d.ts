import { Document, Types } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';
import { Employee } from '../../employees/schemas/employee.schema';
import { Company } from '../../companies/schemas/company.schema';
export type UserDocument = User & Document;
export declare enum UserStatus {
    INVITED = "INVITED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    LOCKED = "LOCKED"
}
export declare class User {
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash?: string;
    refreshTokenHash?: string;
    roleIds: Role[] | Types.ObjectId[];
    employeeId?: Employee | Types.ObjectId;
    companyIds?: Company[] | Types.ObjectId[];
    status: UserStatus;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
    passwordChangedAt?: Date;
    isActive: boolean;
}
export declare const UserSchema: any;
