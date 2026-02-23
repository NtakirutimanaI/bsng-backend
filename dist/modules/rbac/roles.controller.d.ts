import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("./entities/role.entity").Role>;
    create(body: {
        name: string;
        description: string;
        level?: number;
        isSystemRole?: boolean;
    }): Promise<import("./entities/role.entity").Role>;
    update(id: string, body: {
        name?: string;
        description?: string;
        level?: number;
    }): Promise<import("./entities/role.entity").Role | null>;
    remove(id: string): Promise<void>;
}
