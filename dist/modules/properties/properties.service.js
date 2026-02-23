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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./entities/property.entity");
let PropertiesService = class PropertiesService {
    propertiesRepository;
    constructor(propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }
    create(data) {
        const property = this.propertiesRepository.create(data);
        return this.propertiesRepository.save(property);
    }
    async findAll(page = 1, limit = 10, search = '', type = 'all', status = 'all', isForSale, isForRent) {
        const queryBuilder = this.propertiesRepository.createQueryBuilder('property');
        if (search) {
            queryBuilder.andWhere('(property.title ILIKE :search OR property.code ILIKE :search OR property.location ILIKE :search)', { search: `%${search}%` });
        }
        if (type && type !== 'all') {
            queryBuilder.andWhere('property.type = :type', { type });
        }
        if (status && status !== 'all') {
            queryBuilder.andWhere('property.status = :status', { status });
        }
        if (isForSale === 'true') {
            queryBuilder.andWhere('property.isForSale = :isForSale', {
                isForSale: true,
            });
        }
        if (isForRent === 'true') {
            queryBuilder.andWhere('property.isForRent = :isForRent', {
                isForRent: true,
            });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('property.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    findOne(id) {
        return this.propertiesRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.propertiesRepository.update(id, data);
        return this.findOne(id);
    }
    remove(id) {
        return this.propertiesRepository.delete(id);
    }
    async seed() {
        const properties = [
            {
                code: 'PROP-2024-001',
                title: 'Luxury Villa in Nyarutarama',
                type: 'house',
                status: 'available',
                location: 'Nyarutarama, Kigali',
                size: 450,
                price: 250000000,
                monthlyRent: 2000000,
                isForSale: true,
                isForRent: true,
                bedrooms: 5,
                bathrooms: 4,
                image: 'https://picsum.photos/seed/PROP-2024-001/800/600',
                description: 'A stunning 5-bedroom luxury villa located in the prestigious Nyarutarama neighborhood. Features a swimming pool, large garden, and modern amenities.',
                upi: '1/03/04/05/2024',
            },
            {
                code: 'PROP-2024-002',
                title: 'Modern Apartment in City Center',
                type: 'apartment',
                status: 'rented',
                location: 'Downtown Kigali',
                size: 120,
                price: 85000000,
                monthlyRent: 800000,
                isForSale: true,
                isForRent: true,
                bedrooms: 3,
                bathrooms: 2,
                image: 'https://picsum.photos/seed/PROP-2024-002/800/600',
                description: 'Contemporary 3-bedroom apartment in the heart of Kigali. Walking distance to major business centers and shopping malls.',
                upi: '2/01/02/03/1234',
            },
            {
                code: 'PROP-2024-003',
                title: 'Commercial Plot in Kimihurura',
                type: 'plot',
                status: 'available',
                location: 'Kimihurura, Kigali',
                size: 800,
                price: 180000000,
                isForSale: true,
                isForRent: false,
                image: 'https://picsum.photos/seed/PROP-2024-003/800/600',
                description: 'Prime commercial plot suitable for office complex or mixed-use development. Excellent road access and visibility.',
                upi: '3/05/06/07/5678',
            },
            {
                code: 'PROP-2024-004',
                title: 'Cozy Family Home in Kicukiro',
                type: 'house',
                status: 'available',
                location: 'Kicukiro, Kigali',
                size: 300,
                price: 120000000,
                monthlyRent: 1000000,
                isForSale: true,
                isForRent: true,
                bedrooms: 4,
                bathrooms: 3,
                image: 'https://picsum.photos/seed/PROP-2024-004/800/600',
                description: 'Beautiful secluded family home with spacious backyard. Perfect for raising children in a quiet neighborhood.',
                upi: '4/08/09/10/9012',
            },
            {
                code: 'PROP-2024-005',
                title: 'Affordable Plot in Kanombe',
                type: 'plot',
                status: 'available',
                location: 'Kanombe, Kigali',
                size: 500,
                price: 25000000,
                isForSale: true,
                isForRent: false,
                image: 'https://picsum.photos/seed/PROP-2024-005/800/600',
                description: 'Great investment opportunity. Residential plot in developing area near the airport.',
                upi: '5/11/12/13/3456',
            },
            {
                code: 'PROP-2024-006',
                title: 'Executive Penthouse',
                type: 'apartment',
                status: 'available',
                location: 'Kamarange',
                size: 250,
                price: 350000000,
                monthlyRent: 3500000,
                isForSale: true,
                isForRent: true,
                bedrooms: 3,
                bathrooms: 3,
                image: 'https://picsum.photos/seed/PROP-2024-006/800/600',
                description: 'Top floor penthouse with panoramic city views. Private elevator access and wraparound balcony.',
                upi: '6/14/15/16/7890',
            },
        ];
        for (const data of properties) {
            const existing = await this.propertiesRepository.findOne({
                where: { code: data.code },
            });
            if (existing) {
                await this.propertiesRepository.update(existing.id, data);
            }
            else {
                await this.propertiesRepository.save(this.propertiesRepository.create(data));
            }
        }
        return { message: 'Seeding completed', count: properties.length };
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map