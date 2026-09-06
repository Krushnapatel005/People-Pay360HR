import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createDto: any): Promise<{
        id: string;
        code: string;
        name: string;
    }>;
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
