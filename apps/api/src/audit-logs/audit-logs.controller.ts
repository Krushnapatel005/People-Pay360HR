import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Permissions('audit.read') // Assuming only admin or specific roles have this
  async getLogs(
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    return this.auditLogsService.getLogs(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50);
  }
}
