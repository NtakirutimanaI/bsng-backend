import { User } from '../../users/entities/user.entity';
export declare class PageView {
    id: string;
    url: string;
    ip: string;
    userAgent: string;
    country: string;
    city: string;
    userId: string;
    user: User;
    createdAt: Date;
}
