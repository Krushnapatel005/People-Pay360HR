import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
        } | null;
        roles: ({
            role: {
                id: string;
                code: string;
                name: string;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    } & {
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
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
        } | null;
        roles: ({
            role: {
                permissions: ({
                    permission: {
                        id: string;
                        code: string;
                    };
                } & {
                    roleId: string;
                    permissionId: string;
                })[];
            } & {
                id: string;
                code: string;
                name: string;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    } & {
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(createDto: any): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
