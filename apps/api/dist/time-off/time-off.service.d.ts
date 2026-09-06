import { PrismaService } from '../prisma/prisma.service';
export declare class TimeOffService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(employeeId?: string): Promise<({
        employee: {
            id: string;
            employeeNumber: string;
            firstName: string;
            lastName: string;
            workEmail: string;
            jobTitle: string | null;
            department: string | null;
            employmentStatus: import("@prisma/client").$Enums.EmploymentStatus;
            startDate: Date;
            scheduleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        timeOffType: {
            id: string;
            code: string;
            name: string;
            unit: import("@prisma/client").$Enums.TimeOffUnit;
            requiresAllocation: boolean;
            isActive: boolean;
        };
    } & {
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<{
        employee: {
            id: string;
            employeeNumber: string;
            firstName: string;
            lastName: string;
            workEmail: string;
            jobTitle: string | null;
            department: string | null;
            employmentStatus: import("@prisma/client").$Enums.EmploymentStatus;
            startDate: Date;
            scheduleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        timeOffType: {
            id: string;
            code: string;
            name: string;
            unit: import("@prisma/client").$Enums.TimeOffUnit;
            requiresAllocation: boolean;
            isActive: boolean;
        };
    } & {
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createDto: any): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approve(id: string): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    refuse(id: string): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    remove(id: string): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        startDate: Date;
        endDate: Date;
        duration: import("@prisma/client/runtime/library").Decimal;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        status: import("@prisma/client").$Enums.RequestStatus;
        reason: string | null;
        leaveAllocationId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findTypes(): Promise<{
        id: string;
        code: string;
        name: string;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        requiresAllocation: boolean;
        isActive: boolean;
    }[]>;
    createType(data: any): Promise<{
        id: string;
        code: string;
        name: string;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        requiresAllocation: boolean;
        isActive: boolean;
    }>;
    updateType(id: string, data: any): Promise<{
        id: string;
        code: string;
        name: string;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        requiresAllocation: boolean;
        isActive: boolean;
    }>;
    removeType(id: string): Promise<{
        id: string;
        code: string;
        name: string;
        unit: import("@prisma/client").$Enums.TimeOffUnit;
        requiresAllocation: boolean;
        isActive: boolean;
    }>;
    findAllocations(employeeId?: string): Promise<({
        employee: {
            id: string;
            employeeNumber: string;
            firstName: string;
            lastName: string;
            workEmail: string;
            jobTitle: string | null;
            department: string | null;
            employmentStatus: import("@prisma/client").$Enums.EmploymentStatus;
            startDate: Date;
            scheduleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        timeOffType: {
            id: string;
            code: string;
            name: string;
            unit: import("@prisma/client").$Enums.TimeOffUnit;
            requiresAllocation: boolean;
            isActive: boolean;
        };
    } & {
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        validFrom: Date;
        validTo: Date;
        allocatedAmount: import("@prisma/client/runtime/library").Decimal;
        takenAmount: import("@prisma/client/runtime/library").Decimal;
        remainingAmount: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    })[]>;
    createAllocation(data: any): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        validFrom: Date;
        validTo: Date;
        allocatedAmount: import("@prisma/client/runtime/library").Decimal;
        takenAmount: import("@prisma/client/runtime/library").Decimal;
        remainingAmount: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    updateAllocation(id: string, data: any): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        validFrom: Date;
        validTo: Date;
        allocatedAmount: import("@prisma/client/runtime/library").Decimal;
        takenAmount: import("@prisma/client/runtime/library").Decimal;
        remainingAmount: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
    removeAllocation(id: string): Promise<{
        id: string;
        employeeId: string;
        timeOffTypeId: string;
        validFrom: Date;
        validTo: Date;
        allocatedAmount: import("@prisma/client/runtime/library").Decimal;
        takenAmount: import("@prisma/client/runtime/library").Decimal;
        remainingAmount: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
    }>;
}
