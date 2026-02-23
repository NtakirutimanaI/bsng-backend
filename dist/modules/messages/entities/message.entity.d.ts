import { User } from '../../users/entities/user.entity';
export declare class Message {
    id: string;
    senderId: string;
    sender: User;
    receiverId: string;
    receiver: User;
    content: string;
    isRead: boolean;
    createdAt: Date;
}
