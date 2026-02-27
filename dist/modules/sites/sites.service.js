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
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const site_entity_1 = require("./entities/site.entity");
let SitesService = class SitesService {
    sitesRepository;
    constructor(sitesRepository) {
        this.sitesRepository = sitesRepository;
    }
    async create(createSiteDto) {
        const site = this.sitesRepository.create(createSiteDto);
        return await this.sitesRepository.save(site);
    }
    async findAll() {
        return await this.sitesRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const site = await this.sitesRepository.findOne({ where: { id } });
        if (!site)
            throw new common_1.NotFoundException('Site not found');
        return site;
    }
    async update(id, updateSiteDto) {
        const site = await this.findOne(id);
        Object.assign(site, updateSiteDto);
        return await this.sitesRepository.save(site);
    }
    async remove(id) {
        const site = await this.findOne(id);
        return await this.sitesRepository.remove(site);
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(site_entity_1.Site)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SitesService);
//# sourceMappingURL=sites.service.js.map