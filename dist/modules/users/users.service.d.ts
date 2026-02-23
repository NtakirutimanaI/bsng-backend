import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findOne(id: string): Promise<User | null>;
    update(id: string, userData: Partial<User>): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findAll(page?: number, limit?: number, userRole?: string, search?: string): Promise<{
        data: User[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    search(query: string): Promise<User[]>;
    remove(id: string): Promise<void>;
    findByResetToken(token: string): Promise<User | null>;
}
