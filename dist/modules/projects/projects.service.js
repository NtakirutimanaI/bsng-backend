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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
let ProjectsService = class ProjectsService {
    projectsRepository;
    constructor(projectsRepository) {
        this.projectsRepository = projectsRepository;
    }
    create(data) {
        const project = this.projectsRepository.create(data);
        return this.projectsRepository.save(project);
    }
    async findAll(page = 1, limit = 10, search = '', status = 'all') {
        const queryBuilder = this.projectsRepository.createQueryBuilder('project');
        if (search) {
            queryBuilder.andWhere('(project.name ILIKE :search OR project.code ILIKE :search OR project.location ILIKE :search)', { search: `%${search}%` });
        }
        if (status && status !== 'all') {
            queryBuilder.andWhere('project.status = :status', { status });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('project.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.projectsRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.projectsRepository.update(id, data);
        return this.findOne(id);
    }
    remove(id) {
        return this.projectsRepository.delete(id);
    }
    async getProjectStatusCounts() {
        const raw = await this.projectsRepository
            .createQueryBuilder('project')
            .select('project.status', 'status')
            .addSelect('COUNT(project.id)', 'count')
            .groupBy('project.status')
            .getRawMany();
        return raw.map((r) => ({
            status: r.status,
            count: parseInt(r.count, 10),
        }));
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map