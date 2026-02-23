export declare class NotificationsService {
    private notifications;
    findAll(userId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    markAsRead(id: string): Promise<any>;
    create(notification: Partial<any>): Promise<any>;
}
