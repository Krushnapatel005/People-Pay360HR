import { Document, Types } from 'mongoose';
import { Department } from '../../departments/schemas/department.schema';
import { Company } from '../../companies/schemas/company.schema';
import { User } from '../../users/schemas/user.schema';
export type EmployeeDocument = Employee & Document;
export declare enum EmploymentStatus {
    ACTIVE = "ACTIVE",
    ON_LEAVE = "ON_LEAVE",
    INACTIVE = "INACTIVE",
    TERMINATED = "TERMINATED"
}
export declare class Employee {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    preferredName?: string;
    workEmail: string;
    personalEmail?: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    jobTitle?: string;
    departmentId?: Department | Types.ObjectId;
    managerEmployeeId?: Employee | Types.ObjectId;
    companyId?: Company | Types.ObjectId;
    employmentStatus: EmploymentStatus;
    startDate: Date;
    endDate?: Date;
    scheduleId?: Types.ObjectId;
    userId?: User | Types.ObjectId;
    isActive: boolean;
}
export declare const EmployeeSchema: any;
