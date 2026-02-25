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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_entity_1 = require("./entities/content.entity");
const promises_1 = require("fs/promises");
let ContentService = class ContentService {
    contentRepository;
    constructor(contentRepository) {
        this.contentRepository = contentRepository;
    }
    async findAll(page = 1, limit = 10, search, category) {
        const queryBuilder = this.contentRepository
            .createQueryBuilder('content')
            .orderBy('content.order', 'ASC')
            .addOrderBy('content.createdAt', 'DESC');
        if (search) {
            queryBuilder.andWhere(`(content.title ILIKE :search 
          OR content.description ILIKE :search 
          OR content.section ILIKE :search)`, { search: `%${search}%` });
        }
        if (category && category !== 'all') {
            queryBuilder.andWhere('content.section = :category', { category });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async findPublic(section) {
        const queryBuilder = this.contentRepository
            .createQueryBuilder('content')
            .where('content.isActive = :isActive', { isActive: true });
        if (section) {
            queryBuilder.andWhere('content.section = :section', { section });
        }
        return queryBuilder
            .orderBy('content.order', 'ASC')
            .addOrderBy('content.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const content = await this.contentRepository.findOne({
            where: { id },
        });
        if (!content) {
            throw new common_1.NotFoundException('Content not found');
        }
        return content;
    }
    async create(createContentDto, image) {
        try {
            const content = this.contentRepository.create({
                ...createContentDto,
                image: image
                    ? `/uploads/content/${image.filename}`
                    : undefined,
            });
            return await this.contentRepository.save(content);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create content');
        }
    }
    async update(id, updateContentDto, image) {
        const content = await this.findOne(id);
        if (image && content.image) {
            try {
                await (0, promises_1.unlink)(`.${content.image}`);
            }
            catch (error) {
                console.error('Failed to delete old image:', error);
            }
        }
        Object.assign(content, updateContentDto);
        if (image) {
            content.image = `/uploads/content/${image.filename}`;
        }
        return this.contentRepository.save(content);
    }
    async toggleStatus(id, isActive) {
        const content = await this.findOne(id);
        content.isActive = isActive;
        return this.contentRepository.save(content);
    }
    async remove(id) {
        const content = await this.findOne(id);
        if (content.image) {
            try {
                await (0, promises_1.unlink)(`.${content.image}`);
            }
            catch (error) {
                console.error('Failed to delete image:', error);
            }
        }
        return this.contentRepository.remove(content);
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(content_entity_1.Content)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContentService);
//# sourceMappingURL=content.service.js.map