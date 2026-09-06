import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogsService } from './audit-logs.service';
export declare class AuditInterceptor implements NestInterceptor {
    private readonly auditService;
    constructor(auditService: AuditLogsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
