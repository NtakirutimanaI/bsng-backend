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
exports.UpdatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const update_entity_1 = require("./entities/update.entity");
let UpdatesService = class UpdatesService {
    updatesRepository;
    constructor(updatesRepository) {
        this.updatesRepository = updatesRepository;
    }
    create(data) {
        const update = this.updatesRepository.create(data);
        return this.updatesRepository.save(update);
    }
    async findAll(page = 1, limit = 10, search = '', category = '') {
        const queryBuilder = this.updatesRepository.createQueryBuilder('update');
        if (search) {
            queryBuilder.andWhere('(update.title ILIKE :search OR update.excerpt ILIKE :search)', { search: `%${search}%` });
        }
        if (category) {
            queryBuilder.andWhere('update.category = :category', { category });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('update.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.updatesRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.updatesRepository.update(id, data);
        return this.findOne(id);
    }
    remove(id) {
        return this.updatesRepository.delete(id);
    }
    async seed() {
        const updates = [
            {
                title: 'New Luxury Apartments Project Launched',
                excerpt: 'We are excited to announce the launch of our newest residential project in Nyarutarama.',
                content: 'Full details about the project...',
                category: 'Projects',
                author: 'Admin',
                date: new Date().toISOString(),
                image: 'https://picsum.photos/seed/upd1/800/600',
                tags: ['Construction', 'Real Estate'],
            },
            {
                title: 'BSNG Wins Sustainable Building Award',
                excerpt: 'Our commitment to eco-friendly construction has been recognized with a regional award.',
                content: 'Award details...',
                category: 'Awards',
                author: 'Management',
                date: new Date().toISOString(),
                image: 'https://picsum.photos/seed/upd2/800/600',
                tags: ['Award', 'Sustainability'],
            },
            {
                title: 'Annual Charity Gala 2024',
                excerpt: 'Join us for our upcoming charity event to support local community development.',
                content: 'Event details...',
                category: 'Events',
                author: 'PR Team',
                date: new Date().toISOString(),
                image: 'https://picsum.photos/seed/upd3/800/600',
                tags: ['Event', 'Charity'],
            },
            {
                title: 'Expansion into East African Market',
                excerpt: 'BSNG expands operations to Kenya and Uganda, marks a new chapter.',
                content: 'Market expansion news...',
                category: 'Company',
                author: 'CEO',
                date: new Date().toISOString(),
                image: 'https://picsum.photos/seed/upd4/800/600',
                tags: ['Expansion', 'News'],
            },
            {
                title: 'Tips for Maintaining Your New Home',
                excerpt: 'Practical advice from our engineers on keeping your home in top shape.',
                content: 'Maintenance tips...',
                category: 'News',
                author: 'Engineering',
                date: new Date().toISOString(),
                image: 'https://picsum.photos/seed/upd5/800/600',
                tags: ['Tips', 'Maintenance'],
            },
        ];
        for (const u of updates) {
            const existing = await this.updatesRepository.findOne({
                where: { title: u.title },
            });
            if (!existing) {
                await this.updatesRepository.save(this.updatesRepository.create(u));
            }
        }
        return { message: 'Updates seeded successfully', count: updates.length };
    }
};
exports.UpdatesService = UpdatesService;
exports.UpdatesService = UpdatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(update_entity_1.UpdateEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdatesService);
//# sourceMappingURL=updates.service.js.map