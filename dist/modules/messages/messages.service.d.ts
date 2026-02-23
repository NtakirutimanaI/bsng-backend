import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { User } from '../users/entities/user.entity';
export declare class MessagesService {
    private messagesRepository;
    private contactMessagesRepository;
    private usersRepository;
    constructor(messagesRepository: Repository<Message>, contactMessagesRepository: Repository<ContactMessage>, usersRepository: Repository<User>);
    getConversations(userId: string): Promise<any[]>;
    getChat(userId: string, otherUserId: string, page?: number, limit?: number): Promise<{
        data: Message[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    sendMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
    createContactMessage(data: Partial<ContactMessage>): Promise<ContactMessage>;
}
