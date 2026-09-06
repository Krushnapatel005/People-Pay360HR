import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(action: string, resource: string, actorUserId: string | null) {
    return this.prisma.auditLog.create({
      data: {
        action,
        resource,
        actorUserId
      }
    });
  }

  async getLogs(skip?: number, take?: number) {
    return this.prisma.auditLog.findMany({
      skip: skip || 0,
      take: take || 50,
      orderBy: { createdAt: 'desc' }
    });
  }
}
