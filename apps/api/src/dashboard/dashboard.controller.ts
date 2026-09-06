import { Controller, Get, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('my-kpis')
  @Permissions('employees.read') // Employees reading their own dashboard.
  async getMyKpis(@Req() req: any) {
    if (!req.user.employeeId) {
      throw new ForbiddenException('User is not linked to an employee record.');
    }
    return this.dashboardService.getEmployeeKpis(req.user.employeeId);
  }

  @Get('hr-kpis')
  @Permissions('employees.read') // Assuming HR_MANAGER/ADMIN has global employee read.
  async getHrKpis() {
    return this.dashboardService.getHrKpis();
  }

  @Get('time-off-kpis')
  @Permissions('time-off-requests.read') 
  async getTimeOffKpis() {
    return this.dashboardService.getTimeOffAdminKpis();
  }

  @Get('payroll-kpis')
  @Permissions('payroll.read')
  async getPayrollKpis() {
    return this.dashboardService.getPayrollKpis();
  }

  @Get('payroll-trend')
  @Permissions('payroll.read')
  async getPayrollTrend() {
    return this.dashboardService.getPayrollTrend();
  }
}
