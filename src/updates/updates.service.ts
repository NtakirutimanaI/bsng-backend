import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Update } from './update.entity';
import { CreateUpdateDto } from './dto/create-update.dto';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectRepository(Update)
    private readonly updatesRepo: Repository<Update>,
  ) {}

  async create(dto: CreateUpdateDto): Promise<Update> {
    const update = this.updatesRepo.create(dto);
    return this.updatesRepo.save(update);
  }

  async findAll(): Promise<Update[]> {
    return this.updatesRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Update | null> {
    return this.updatesRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: Partial<CreateUpdateDto>): Promise<Update | null> {
    await this.updatesRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.updatesRepo.delete(id);
  }
}
