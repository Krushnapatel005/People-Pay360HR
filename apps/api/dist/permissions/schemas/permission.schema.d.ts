import { Document } from 'mongoose';
export type PermissionDocument = Permission & Document;
export declare class Permission {
    code: string;
    name: string;
    module: string;
    resource: string;
    action: string;
    description?: string;
    isActive: boolean;
}
export declare const PermissionSchema: any;
