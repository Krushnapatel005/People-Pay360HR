import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type PasswordResetTokenDocument = PasswordResetToken & Document;
export declare class PasswordResetToken {
    userId: User | Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    usedAt?: Date;
}
export declare const PasswordResetTokenSchema: any;
