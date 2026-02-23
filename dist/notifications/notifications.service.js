"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
let NotificationsService = class NotificationsService {
    notifications = [
        {
            id: '1',
            userId: 'default-user',
            title: 'New Project Created',
            message: 'A new construction project has been assigned to you',
            type: 'info',
            priority: 'medium',
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
            id: '2',
            userId: 'default-user',
            title: 'Salary Payment Processed',
            message: 'Your February 2026 salary has been processed and paid',
            type: 'success',
            priority: 'high',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            id: '3',
            userId: 'default-user',
            title: 'Attendance Record Updated',
            message: 'Your attendance has been marked for today',
            type: 'info',
            priority: 'low',
            isRead: true,
            createdAt: new Date(),
        },
        {
            id: '4',
            userId: 'default-user',
            title: 'Document Approval Pending',
            message: 'Your project documents require admin approval',
            type: 'warning',
            priority: 'high',
            isRead: false,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
        {
            id: '5',
            userId: 'default-user',
            title: 'Site Meeting Scheduled',
            message: 'A site meeting has been scheduled for tomorrow at 10 AM',
            type: 'info',
            priority: 'medium',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
    ];
    async findAll(userId) {
        if (!userId) {
            return this.notifications;
        }
        return this.notifications.filter((n) => n.userId === userId || n.userId === 'default-user');
    }
    async findOne(id) {
        return this.notifications.find((n) => n.id === id);
    }
    async markAsRead(id) {
        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
            notification.isRead = true;
        }
        return notification;
    }
    async create(notification) {
        const newNotification = {
            id: String(Date.now()),
            ...notification,
            createdAt: new Date(),
        };
        this.notifications.push(newNotification);
        return newNotification;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map