import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(ContactMessage)
    private contactMessagesRepository: Repository<ContactMessage>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getConversations(userId: string) {
    // This is a bit complex in TypeORM without raw query, but we can do it
    // We want users who sent to us or we sent to them
    const messages = await this.messagesRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
      relations: ['sender', 'receiver'],
    });

    const seenUsers = new Map<string, any>();

    messages.forEach((msg) => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!otherUser) return;

      if (!seenUsers.has(otherUser.id)) {
        seenUsers.set(otherUser.id, {
          id: otherUser.id,
          name: otherUser.fullName,
          lastMessage: msg.content,
          time: msg.createdAt,
          unread: msg.receiverId === userId && !msg.isRead ? 1 : 0,
          status: 'online', // Mock status for now
          avatar: null,
        });
      } else if (msg.receiverId === userId && !msg.isRead) {
        seenUsers.get(otherUser.id).unread++;
      }
    });

    return Array.from(seenUsers.values());
  }

  async getChat(
    userId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const [data, total] = await this.messagesRepository.findAndCount({
      where: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['sender', 'receiver'],
    });

    // Mark as read while fetching
    await this.messagesRepository.update(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true },
    );

    return {
      data: data.reverse(), // Reverse to show oldest to newest
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = this.messagesRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messagesRepository.save(message);
  }

  async createContactMessage(data: Partial<ContactMessage>) {
    const msg = this.contactMessagesRepository.create(data);
    const contactMessage = await this.contactMessagesRepository.save(msg);

    // Also create a Message so it appears in the chat
    try {
      if (!data.email || !data.name) return contactMessage;

      // 1. Find or create sender
      let sender = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (!sender) {
        sender = this.usersRepository.create({
          email: data.email,
          fullName: data.name,
          username: data.email.split('@')[0], // simple username
          roleId: 'client', // defaulting to client role ID or similar
          userRole: 'client' as any, // assuming 'client' is a role
          passwordHash: '', // Empty string instead of null if TS is strict
        });
        sender = await this.usersRepository.save(sender);
      }

      // 2. Find a receiver (Admin)
      // Ideally we'd have a specific admin/support user ID in env or config
      // For now, let's find the first ADMIN or SUPER_ADMIN
      const admin = await this.usersRepository.findOne({
        where: [
          { userRole: 'super_admin' as any },
          { userRole: 'admin' as any },
        ],
      });

      if (admin) {
        await this.sendMessage(
          sender.id,
          admin.id,
          `[Contact Form] ${data.subject}: ${data.message}`,
        );
      }
    } catch (error) {
      console.error(
        'Failed to create chat message for contact form submission:',
        error,
      );
      // Don't fail the contact form submission if chat creation fails
    }

    return contactMessage;
  }
}
