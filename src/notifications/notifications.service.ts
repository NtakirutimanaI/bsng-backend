import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  // In-memory notifications storage (should be replaced with database)
  private notifications: any[] = [
    {
      id: '1',
      userId: 'default-user',
      title: 'New Project Created',
      message: 'A new construction project has been assigned to you',
      type: 'info',
      priority: 'medium',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '2',
      userId: 'default-user',
      title: 'Salary Payment Processed',
      message: 'Your February 2026 salary has been processed and paid',
      type: 'success',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      userId: 'default-user',
      title: 'Attendance Record Updated',
      message: 'Your attendance has been marked for today',
      type: 'info',
      priority: 'low',
      isRead: true,
      createdAt: new Date(), // Today
    },
    {
      id: '4',
      userId: 'default-user',
      title: 'Document Approval Pending',
      message: 'Your project documents require admin approval',
      type: 'warning',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: '5',
      userId: 'default-user',
      title: 'Site Meeting Scheduled',
      message: 'A site meeting has been scheduled for tomorrow at 10 AM',
      type: 'info',
      priority: 'medium',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
  ];

  async findAll(userId?: string): Promise<any[]> {
    if (!userId) {
      return this.notifications;
    }
    return this.notifications.filter(
      (n) => n.userId === userId || n.userId === 'default-user',
    );
  }

  async findOne(id: string): Promise<any> {
    return this.notifications.find((n) => n.id === id);
  }

  async markAsRead(id: string): Promise<any> {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  }

  async create(notification: Partial<any>): Promise<any> {
    const newNotification = {
      id: String(Date.now()),
      ...notification,
      createdAt: new Date(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }
}
