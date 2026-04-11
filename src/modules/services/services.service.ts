import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    async findAll() {
        return this.servicesRepository.find({ order: { order: 'ASC' } });
    }

    async findAllActive() {
        return this.servicesRepository.find({
            where: { isActive: true },
            order: { order: 'ASC' },
        });
    }

    async findOne(id: string) {
        const service = await this.servicesRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }

    async create(createServiceDto: CreateServiceDto) {
        const service = this.servicesRepository.create(createServiceDto);
        return this.servicesRepository.save(service);
    }

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return this.servicesRepository.save(service);
    }

    async remove(id: string) {
        const service = await this.findOne(id);
        return this.servicesRepository.remove(service);
    }

    async seed() {
        const existingCount = await this.servicesRepository.count();
        if (existingCount > 0) return { message: 'Services already seeded' };

        const initialServices: CreateServiceDto[] = [
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
}
