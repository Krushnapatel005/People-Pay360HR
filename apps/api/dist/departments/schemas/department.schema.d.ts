import { Document, Types } from 'mongoose';
import { Company } from '../../companies/schemas/company.schema';
import { Employee } from '../../employees/schemas/employee.schema';
export type DepartmentDocument = Department & Document;
export declare class Department {
    name: string;
    code: string;
    companyId: Company | Types.ObjectId;
    managerEmployeeId?: Employee | Types.ObjectId;
    isActive: boolean;
}
export declare const DepartmentSchema: any;
