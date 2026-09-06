import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getEmployeeKpis(employeeId: string): Promise<{
        pendingTimeOff: number;
        totalAllocated: number;
        totalTaken: number;
        totalRemaining: number;
        lastNetSalary: number;
        lastPayslipPeriod: string | null;
        attendanceRate: number;
    }>;
    getHrKpis(): Promise<{
        totalEmployees: number;
        pendingLeaveRequests: number;
        expiringContracts: number;
        attendanceRate: number;
        departmentCounts: {
            department: string;
            count: number;
        }[];
    }>;
    getTimeOffAdminKpis(): Promise<{
        pendingRequests: number;
        approvedThisMonth: number;
        leaveTypesActive: number;
        totalDaysAllocated: number;
    }>;
    getPayrollKpis(): Promise<{
        activePayruns: number;
        lastPayrunNet: number;
        lastPayrunPeriod: string | null;
        payslipsGenerated: number;
        exceptionsFound: number;
    }>;
    getPayrollTrend(): Promise<{
        periodStart: any;
        reference: any;
        grossTotal: number;
        netTotal: number;
        deductionTotal: number;
    }[]>;
}
