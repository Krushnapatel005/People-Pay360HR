import { ContractsService } from './contracts.service';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createDto: any): Promise<{
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
    update(id: string, updateDto: any): Promise<{
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
}
