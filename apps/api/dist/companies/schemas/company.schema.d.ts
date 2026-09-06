import { Document } from 'mongoose';
export type CompanyDocument = Company & Document;
export declare class Company {
    name: string;
    legalName?: string;
    companyCode: string;
    workEmail?: string;
    phone?: string;
    address?: string;
    currency: string;
    timezone: string;
    fiscalYearStart?: Date;
    isActive: boolean;
}
export declare const CompanySchema: any;
