import { PrismaService } from '../prisma/prisma.service';
export declare class WorkingSchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        days: {
            id: string;
            workingScheduleId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            breakMinutes: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.ScheduleType;
        weeklyHours: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<{
        days: {
            id: string;
            workingScheduleId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            breakMinutes: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.ScheduleType;
        weeklyHours: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private calculateWeeklyHours;
    create(createDto: any): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.ScheduleType;
        weeklyHours: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.ScheduleType;
        weeklyHours: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        type: import("@prisma/client").$Enums.ScheduleType;
        weeklyHours: import("@prisma/client/runtime/library").Decimal;
        timezone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
