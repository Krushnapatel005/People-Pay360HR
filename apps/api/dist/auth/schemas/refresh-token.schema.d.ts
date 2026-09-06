import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type RefreshTokenDocument = RefreshToken & Document;
export declare class RefreshToken {
    userId: User | Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revokedAt?: Date;
    userAgent?: string;
    ipAddress?: string;
}
export declare const RefreshTokenSchema: any;
