import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepo.create(dto);
    return this.servicesRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<Service | null> {
    return this.servicesRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: Partial<CreateServiceDto>): Promise<Service | null> {
    await this.servicesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.servicesRepo.delete(id);
  }
}
