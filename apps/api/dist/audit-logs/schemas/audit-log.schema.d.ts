import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type AuditLogDocument = AuditLog & Document;
export declare class AuditLog {
    actorUserId?: User | Types.ObjectId;
    companyId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    before?: Record<string, any>;
    after?: Record<string, any>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare const AuditLogSchema: any;
