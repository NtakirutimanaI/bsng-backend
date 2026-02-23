import { Role } from './role.entity';
export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    APPROVE = "approve",
    PROCESS = "process"
}
export declare class Permission {
    id: string;
    module: string;
    action: PermissionAction;
    resource: string;
    description: string;
    createdAt: Date;
    roles: Role[];
}
