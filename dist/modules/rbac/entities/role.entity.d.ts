import { User } from '../../users/entities/user.entity';
import { Permission } from './permission.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    level: number;
    isSystemRole: boolean;
    createdAt: Date;
    users: User[];
    permissions: Permission[];
}
