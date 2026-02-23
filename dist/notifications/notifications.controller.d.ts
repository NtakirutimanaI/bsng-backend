import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<any[]>;
    markAsRead(id: string): Promise<any>;
    findOne(id: string): Promise<any>;
}
