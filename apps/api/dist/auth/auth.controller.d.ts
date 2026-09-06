import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(body: any, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            roles: any;
            employeeId: any;
        };
    }>;
    logout(user: any, res: Response): Promise<{
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            roles: any;
            employeeId: any;
        };
    }>;
    getProfile(user: any): {
        user: any;
    };
    forgotPassword(body: any): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
    private setCookies;
    private clearCookies;
}
