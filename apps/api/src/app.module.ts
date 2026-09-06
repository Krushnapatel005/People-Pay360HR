import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimeOffModule } from './time-off/time-off.module';
import { ContractsModule } from './contracts/contracts.module';
import { WorkingSchedulesModule } from './working-schedules/working-schedules.module';
import { PayrollModule } from './payroll/payroll.module';
import { RolesModule } from './roles/roles.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuditInterceptor } from './audit-logs/audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    AttendanceModule,
    TimeOffModule,
    ContractsModule,
    WorkingSchedulesModule,
    PayrollModule,
    RolesModule,
    DashboardModule,
    AuditLogsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
