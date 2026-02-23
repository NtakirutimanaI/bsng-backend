import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission, PermissionAction } from './entities/permission.entity';
export declare class RolesService {
    private rolesRepository;
    private permissionsRepository;
    constructor(rolesRepository: Repository<Role>, permissionsRepository: Repository<Permission>);
    createRole(name: string, description: string, level?: number, isSystemRole?: boolean): Promise<Role>;
    createPermission(module: string, action: PermissionAction, resource: string, description: string): Promise<Permission>;
    addPermissionToRole(roleName: string, permission: Permission): Promise<void>;
    checkPermission(userId: string, module: string, action: string, resource: string): Promise<boolean>;
    findRoleByName(name: string): Promise<Role | null>;
    findAll(): Promise<Role[]>;
    findOneById(id: string): Promise<Role | null>;
    updateRole(id: string, data: Partial<Role>): Promise<Role | null>;
    removeRole(id: string): Promise<void>;
}
