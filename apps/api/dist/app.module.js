"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const employees_module_1 = require("./employees/employees.module");
const attendance_module_1 = require("./attendance/attendance.module");
const time_off_module_1 = require("./time-off/time-off.module");
const contracts_module_1 = require("./contracts/contracts.module");
const working_schedules_module_1 = require("./working-schedules/working-schedules.module");
const payroll_module_1 = require("./payroll/payroll.module");
const roles_module_1 = require("./roles/roles.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const audit_interceptor_1 = require("./audit-logs/audit.interceptor");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            employees_module_1.EmployeesModule,
            attendance_module_1.AttendanceModule,
            time_off_module_1.TimeOffModule,
            contracts_module_1.ContractsModule,
            working_schedules_module_1.WorkingSchedulesModule,
            payroll_module_1.PayrollModule,
            roles_module_1.RolesModule,
            dashboard_module_1.DashboardModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map