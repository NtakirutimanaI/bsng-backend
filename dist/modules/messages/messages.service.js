"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./entities/message.entity");
const contact_message_entity_1 = require("./entities/contact-message.entity");
const user_entity_1 = require("../users/entities/user.entity");
let MessagesService = class MessagesService {
    messagesRepository;
    contactMessagesRepository;
    usersRepository;
    constructor(messagesRepository, contactMessagesRepository, usersRepository) {
        this.messagesRepository = messagesRepository;
        this.contactMessagesRepository = contactMessagesRepository;
        this.usersRepository = usersRepository;
    }
    async getConversations(userId) {
        const messages = await this.messagesRepository.find({
            where: [{ senderId: userId }, { receiverId: userId }],
            order: { createdAt: 'DESC' },
            relations: ['sender', 'receiver'],
        });
        const seenUsers = new Map();
        messages.forEach((msg) => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            if (!otherUser)
                return;
            if (!seenUsers.has(otherUser.id)) {
                seenUsers.set(otherUser.id, {
                    id: otherUser.id,
                    name: otherUser.fullName,
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    unread: msg.receiverId === userId && !msg.isRead ? 1 : 0,
                    status: 'online',
                    avatar: null,
                });
            }
            else if (msg.receiverId === userId && !msg.isRead) {
                seenUsers.get(otherUser.id).unread++;
            }
        });
        return Array.from(seenUsers.values());
    }
    async getChat(userId, otherUserId, page = 1, limit = 50) {
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
        await this.messagesRepository.update({ senderId: otherUserId, receiverId: userId, isRead: false }, { isRead: true });
        return {
            data: data.reverse(),
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async sendMessage(senderId, receiverId, content) {
        const message = this.messagesRepository.create({
            senderId,
            receiverId,
            content,
        });
        return this.messagesRepository.save(message);
    }
    async createContactMessage(data) {
        const msg = this.contactMessagesRepository.create(data);
        const contactMessage = await this.contactMessagesRepository.save(msg);
        try {
            if (!data.email || !data.name)
                return contactMessage;
            let sender = await this.usersRepository.findOne({
                where: { email: data.email },
            });
            if (!sender) {
                sender = this.usersRepository.create({
                    email: data.email,
                    fullName: data.name,
                    username: data.email.split('@')[0],
                    roleId: 'client',
                    userRole: 'client',
                    passwordHash: '',
                });
                sender = await this.usersRepository.save(sender);
            }
            const admin = await this.usersRepository.findOne({
                where: [
                    { userRole: 'super_admin' },
                    { userRole: 'admin' },
                ],
            });
            if (admin) {
                await this.sendMessage(sender.id, admin.id, `[Contact Form] ${data.subject}: ${data.message}`);
            }
        }
        catch (error) {
            console.error('Failed to create chat message for contact form submission:', error);
        }
        return contactMessage;
    }
    async getContactMessages(page = 1, limit = 50, status) {
        const whereClause = status && status !== 'all' ? { status } : {};
        const [data, total] = await this.contactMessagesRepository.findAndCount({
            where: whereClause,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const unreadCount = await this.contactMessagesRepository.count({
            where: { status: 'new' },
        });
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
            unreadCount,
        };
    }
    async updateContactStatus(id, status) {
        await this.contactMessagesRepository.update(id, { status });
        return this.contactMessagesRepository.findOne({ where: { id } });
    }
    async deleteContactMessage(id) {
        await this.contactMessagesRepository.update(id, { status: 'deleted' });
        return { success: true };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(contact_message_entity_1.ContactMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map