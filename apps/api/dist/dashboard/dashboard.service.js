"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEmployeeKpis(employeeId) {
        const now = new Date();
        const pendingTimeOff = await this.prisma.timeOffRequest.count({
            where: { employeeId, status: 'PENDING' }
        });
        const allocations = await this.prisma.leaveAllocation.findMany({
            where: { employeeId, isActive: true, validFrom: { lte: now }, validTo: { gte: now } }
        });
        const totalAllocated = allocations.reduce((sum, a) => sum + Number(a.allocatedAmount), 0);
        const totalTaken = allocations.reduce((sum, a) => sum + Number(a.takenAmount), 0);
        const totalRemaining = allocations.reduce((sum, a) => sum + Number(a.remainingAmount), 0);
        const lastPayslip = await this.prisma.payslip.findFirst({
            where: { employeeId, status: 'PAID' },
            orderBy: { periodStart: 'desc' }
        });
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
        const exceptions = 0;
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
        return payruns.map((p) => ({
            periodStart: p.periodStart.toISOString(),
            reference: p.reference,
            grossTotal: Number(p.grossTotal),
            netTotal: Number(p.netTotal),
            deductionTotal: Number(p.deductionTotal)
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map