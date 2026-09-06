import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logAction(action: string, resource: string, actorUserId: string | null): Promise<{
        id: string;
        action: string;
        resource: string;
        actorUserId: string | null;
        createdAt: Date;
    }>;
    getLogs(skip?: number, take?: number): Promise<{
        id: string;
        action: string;
        resource: string;
        actorUserId: string | null;
        createdAt: Date;
    }[]>;
}
