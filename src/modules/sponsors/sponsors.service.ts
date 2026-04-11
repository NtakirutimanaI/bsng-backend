import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from './entities/sponsor.entity';

@Injectable()
export class SponsorsService {
  constructor(
    @InjectRepository(Sponsor)
    private sponsorsRepository: Repository<Sponsor>,
  ) {}

  create(data: Partial<Sponsor>) {
    const sponsor = this.sponsorsRepository.create(data);
    return this.sponsorsRepository.save(sponsor);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    type: string = 'all',
  ) {
    const queryBuilder = this.sponsorsRepository.createQueryBuilder('sponsor');

    if (search) {
      queryBuilder.andWhere(
        '(sponsor.name ILIKE :search OR sponsor.contactPerson ILIKE :search OR sponsor.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type && type !== 'all') {
      queryBuilder.andWhere('sponsor.type = :type', { type });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('sponsor.name', 'ASC')
      .getManyAndCount();
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.sponsorsRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Sponsor>) {
    await this.sponsorsRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.sponsorsRepository.delete(id);
  }
}
