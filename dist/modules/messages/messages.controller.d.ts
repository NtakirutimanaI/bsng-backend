import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversations(userId: string): Promise<any[]>;
    getChat(userId: string, otherUserId: string, page?: number, limit?: number): Promise<{
        data: import("./entities/message.entity").Message[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    sendMessage(body: {
        senderId: string;
        receiverId: string;
        content: string;
    }): Promise<import("./entities/message.entity").Message>;
    submitContact(body: any): Promise<import("./entities/contact-message.entity").ContactMessage>;
    getContactMessages(page?: number, limit?: number, status?: string): Promise<{
        data: import("./entities/contact-message.entity").ContactMessage[];
        total: number;
        page: number;
        lastPage: number;
        unreadCount: number;
    }>;
    updateContactStatus(id: string, status: string): Promise<import("./entities/contact-message.entity").ContactMessage | null>;
    deleteContactMessage(id: string): Promise<{
        success: boolean;
    }>;
}
