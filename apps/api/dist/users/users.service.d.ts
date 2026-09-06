import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
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
    findByEmail(email: string): Promise<({
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
    }) | null>;
    create(createUserDto: any): Promise<{
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
    update(id: string, updateUserDto: any): Promise<{
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
    setLastLogin(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        refreshTokenHash: string | null;
        lastLogin: Date | null;
        status: import("@prisma/client").$Enums.UserStatus;
        employeeId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
}
