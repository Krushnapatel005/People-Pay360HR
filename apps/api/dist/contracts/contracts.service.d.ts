import { PrismaService } from '../prisma/prisma.service';
export declare class ContractsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
    } & {
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
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
    } & {
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createContractDto: any): Promise<{
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateContractDto: any): Promise<{
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findApplicableContract(employeeId: string, periodStart: Date, periodEnd: Date): Promise<{
        id: string;
        employeeId: string;
        reference: string;
        startDate: Date;
        endDate: Date | null;
        status: import("@prisma/client").$Enums.ContractStatus;
        wageAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        scheduleId: string | null;
        salaryStructureId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    validateContractDates(employeeId: string, startDate: string | Date, endDate?: string | Date | null, excludeContractId?: string): Promise<void>;
}
