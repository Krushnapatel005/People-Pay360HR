import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
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
    findAll(req: any, skip?: string, take?: string, search?: string): Promise<{
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
