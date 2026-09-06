import { PrismaService } from '../prisma/prisma.service';
export declare class AttendanceService {
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
    } & {
        id: string;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        workedHours: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
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
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        workedHours: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createDto: any): Promise<{
        id: string;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        workedHours: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        workedHours: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        workedHours: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private validateAttendance;
    private calculateWorkedHours;
}
