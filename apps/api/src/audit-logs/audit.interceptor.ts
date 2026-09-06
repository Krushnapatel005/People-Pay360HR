import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from './audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Only log mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const resource = url.split('?')[0]; // simple resource mapping
      const action = `${method} ${resource}`;
      const actorId = user ? user.id : null;

      // Log before returning
      return next.handle().pipe(
        tap(() => {
          this.auditService.logAction(action, resource, actorId).catch((err) => {
             console.error('Failed to write audit log', err);
          });
        }),
      );
    }

    return next.handle();
  }
}
