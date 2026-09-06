import { PrismaService } from '../prisma/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
    })[]>;
    findById(id: string): Promise<{
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
    }>;
    create(createDto: any): Promise<{
        id: string;
        code: string;
        name: string;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        code: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        code: string;
        name: string;
    }>;
}
