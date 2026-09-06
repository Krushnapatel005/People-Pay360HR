import { Document, Types } from 'mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';
export type RoleDocument = Role & Document;
export declare class Role {
    code: string;
    name: string;
    permissionIds: Permission[] | Types.ObjectId[];
    isSystemRole: boolean;
    isActive: boolean;
}
export declare const RoleSchema: any;
