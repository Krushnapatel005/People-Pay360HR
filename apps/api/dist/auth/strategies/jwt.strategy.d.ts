import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
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
}
export {};
