import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    getLogs(skip?: string, take?: string): Promise<{
        id: string;
        action: string;
        resource: string;
        actorUserId: string | null;
        createdAt: Date;
    }[]>;
}
