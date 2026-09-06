import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeKpis(employeeId: string) {
    const now = new Date();
    
    // Time off requests pending
    const pendingTimeOff = await this.prisma.timeOffRequest.count({
      where: { employeeId, status: 'PENDING' }
    });

    // Time off allocations and usage
    const allocations = await this.prisma.leaveAllocation.findMany({
      where: { employeeId, isActive: true, validFrom: { lte: now }, validTo: { gte: now } }
    });
    const totalAllocated = allocations.reduce((sum: number, a: any) => sum + Number(a.allocatedAmount), 0);
    const totalTaken = allocations.reduce((sum: number, a: any) => sum + Number(a.takenAmount), 0);
    const totalRemaining = allocations.reduce((sum: number, a: any) => sum + Number(a.remainingAmount), 0);

    // Last payslip
    const lastPayslip = await this.prisma.payslip.findFirst({
      where: { employeeId, status: 'PAID' },
      orderBy: { periodStart: 'desc' }
    });

    // Attendance stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalAttendance = await this.prisma.attendance.count({
      where: { employeeId, date: { gte: monthStart } }
    });
    const presentAttendance = await this.prisma.attendance.count({
      where: { employeeId, date: { gte: monthStart }, status: 'PRESENT' }
    });
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    return {
      pendingTimeOff,
      totalAllocated,
      totalTaken,
      totalRemaining,
      lastNetSalary: lastPayslip ? Number(lastPayslip.netPay) : 0,
      lastPayslipPeriod: lastPayslip ? lastPayslip.periodStart.toISOString() : null,
      attendanceRate
    };
  }

  async getHrKpis() {
    const totalEmployees = await this.prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } });
    const pendingLeaveRequests = await this.prisma.timeOffRequest.count({ where: { status: 'PENDING' } });
    
    const now = new Date();
    const next60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const expiringContracts = await this.prisma.contract.count({
      where: { status: 'ACTIVE', endDate: { lte: next60Days, gte: now } }
    });

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalAttendance = await this.prisma.attendance.count({ where: { date: { gte: monthStart } } });
    const presentAttendance = await this.prisma.attendance.count({ where: { date: { gte: monthStart }, status: 'PRESENT' } });
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    // Department grouping
    const departmentCountsRaw = await this.prisma.employee.groupBy({
      by: ['department'],
      _count: { id: true },
      where: { employmentStatus: 'ACTIVE' }
    });
    const departmentCounts = departmentCountsRaw.map(d => ({
      department: d.department || 'Unassigned',
      count: d._count.id
    }));

    return {
      totalEmployees,
      pendingLeaveRequests,
      expiringContracts,
      attendanceRate,
      departmentCounts
    };
  }

  async getTimeOffAdminKpis() {
    const pendingRequests = await this.prisma.timeOffRequest.count({ where: { status: 'PENDING' } });
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const approvedThisMonth = await this.prisma.timeOffRequest.count({
      where: { status: 'APPROVED', updatedAt: { gte: monthStart } }
    });
    const leaveTypesActive = await this.prisma.timeOffType.count({ where: { isActive: true } });
    const totalAllocationsAgg = await this.prisma.leaveAllocation.aggregate({
      _sum: { allocatedAmount: true },
      where: { isActive: true }
    });

    return {
      pendingRequests,
      approvedThisMonth,
      leaveTypesActive,
      totalDaysAllocated: Number(totalAllocationsAgg._sum.allocatedAmount || 0)
    };
  }

  async getPayrollKpis() {
    const activePayruns = await this.prisma.payrun.count({ where: { status: { in: ['DRAFT', 'COMPUTED'] } } });
    const exceptions = 0; // In a full implementation, you'd check for specific warning flags.
    
    const lastPaidPayrun = await this.prisma.payrun.findFirst({
      where: { status: 'PAID' },
      orderBy: { periodStart: 'desc' }
    });
    
    const payslipsGenerated = lastPaidPayrun ? await this.prisma.payslip.count({ where: { payrunId: lastPaidPayrun.id } }) : 0;

    return {
      activePayruns,
      lastPayrunNet: lastPaidPayrun ? Number(lastPaidPayrun.netTotal) : 0,
      lastPayrunPeriod: lastPaidPayrun ? lastPaidPayrun.periodStart.toISOString() : null,
      payslipsGenerated,
      exceptionsFound: exceptions
    };
  }

  async getPayrollTrend() {
    const payruns = await this.prisma.payrun.findMany({
      where: { status: 'PAID' },
      orderBy: { periodStart: 'asc' },
      take: 6
    });

    return payruns.map((p: any) => ({
      periodStart: p.periodStart.toISOString(),
      reference: p.reference,
      grossTotal: Number(p.grossTotal),
      netTotal: Number(p.netTotal),
      deductionTotal: Number(p.deductionTotal)
    }));
  }
}
