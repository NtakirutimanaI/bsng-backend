import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(body: Record<string, string>): Promise<{
        id: string;
        username: string;
        email: string;
        phone: string;
        googleId: string;
        fullName: string;
        roleId: string;
        role: import("../rbac/entities/role.entity").Role;
        userRole: import("./entities/user.entity").UserRole;
        language: string;
        country: string;
        timezone: string;
        isActive: boolean;
        resetToken: string;
        resetTokenExpires: Date;
        createdAt: Date;
    }>;
    search(query: string): Promise<User[]>;
    findAll(page?: number, limit?: number, userRole?: string, search?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<User>;
    create(body: Partial<User> & {
        password?: string;
    }): Promise<User>;
    update(id: string, body: Partial<User> & {
        password?: string;
    }): Promise<User | null>;
    remove(id: string): Promise<void>;
}
