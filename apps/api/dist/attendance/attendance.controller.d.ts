import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
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
    findAll(req: any): Promise<({
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
    findById(id: string, req: any): Promise<{
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
}
