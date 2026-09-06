import { PrismaService } from '../prisma/prisma.service';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(skip?: number, take?: number, search?: string, employeeId?: string): Promise<{
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
    }[]>;
    findById(id: string): Promise<{
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
    }>;
    create(createEmployeeDto: any): Promise<{
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
    }>;
    update(id: string, updateEmployeeDto: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
