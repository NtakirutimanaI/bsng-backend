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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
let ServicesService = class ServicesService {
    servicesRepository;
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async findAll() {
        return this.servicesRepository.find({ order: { order: 'ASC' } });
    }
    async findAllActive() {
        return this.servicesRepository.find({
            where: { isActive: true },
            order: { order: 'ASC' },
        });
    }
    async findOne(id) {
        const service = await this.servicesRepository.findOne({ where: { id } });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async create(createServiceDto) {
        const service = this.servicesRepository.create(createServiceDto);
        return this.servicesRepository.save(service);
    }
    async update(id, updateServiceDto) {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return this.servicesRepository.save(service);
    }
    async remove(id) {
        const service = await this.findOne(id);
        return this.servicesRepository.remove(service);
    }
    async seed() {
        const existingCount = await this.servicesRepository.count();
        if (existingCount > 0)
            return { message: 'Services already seeded' };
        const initialServices = [
            {
                name: 'residentialConstruction',
                title: 'Residential Construction',
                description: 'Custom homes designed and built to your specifications with the highest quality standards.',
                image: '/img/service-1.jpg',
                delay: '0.1s',
                isDark: true,
                order: 1,
            },
            {
                name: 'commercialConstruction',
                title: 'Commercial Construction',
                description: 'Durable and functional commercial spaces that support your business growth and efficiency.',
                image: '/img/service-2.jpg',
                delay: '0.2s',
                isDark: false,
                order: 2,
            },
            {
                name: 'propertyDevelopment',
                title: 'Property Development',
                description: 'Strategic property development solutions from site selection to project completion.',
                image: '/img/service-3.jpg',
                delay: '0.3s',
                isDark: false,
                order: 3,
            },
            {
                name: 'renovationRemodeling',
                title: 'Renovation & Remodeling',
                description: 'Transform your existing space with our expert renovation and remodeling services.',
                image: '/img/service-4.jpg',
                delay: '0.4s',
                isDark: true,
                order: 4,
            },
            {
                name: 'projectManagement',
                title: 'Project Management',
                description: 'Professional project management to ensure your construction stays on time and on budget.',
                image: '/img/service-1.jpg',
                delay: '0.5s',
                isDark: true,
                order: 5,
            },
            {
                name: 'realEstateSales',
                title: 'Real Estate Sales',
                description: 'Expert assistance in buying and selling properties across Rwanda.',
                image: '/img/service-2.jpg',
                delay: '0.6s',
                isDark: false,
                order: 6,
            },
            {
                name: 'propertyRentals',
                title: 'Property Rentals',
                description: 'Comprehensive property management and rental services for owners and tenants.',
                image: '/img/service-3.jpg',
                delay: '0.7s',
                isDark: false,
                order: 7,
            },
            {
                name: 'consultationServices',
                title: 'Consultation Services',
                description: 'Professional consultation for all your construction and real estate needs.',
                image: '/img/service-4.jpg',
                delay: '0.8s',
                isDark: true,
                order: 8,
            },
            {
                name: 'subconstruction',
                title: 'Subconstruction',
                description: 'Expert sub-contracting services for specialized construction phases and structural works.',
                image: '/img/service-1.jpg',
                delay: '0.9s',
                isDark: false,
                order: 9,
            },
            {
                name: 'brokerage',
                title: 'Brokerage',
                description: 'Professional brokerage services for large-scale property transactions and investment opportunities.',
                image: '/img/service-2.jpg',
                delay: '1.0s',
                isDark: true,
                order: 10,
            }
        ];
        for (const s of initialServices) {
            await this.create(s);
        }
        return { message: 'Services seeded successfully', count: initialServices.length };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map