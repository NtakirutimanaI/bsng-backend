import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEntity } from './entities/update.entity';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectRepository(UpdateEntity)
    private updatesRepository: Repository<UpdateEntity>,
  ) {}

  create(data: Partial<UpdateEntity>) {
    const update = this.updatesRepository.create(data);
    return this.updatesRepository.save(update);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    category: string = '',
  ) {
    const queryBuilder = this.updatesRepository.createQueryBuilder('update');

    if (search) {
      queryBuilder.andWhere(
        '(update.title ILIKE :search OR update.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
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

  findOne(id: string) {
    return this.updatesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<UpdateEntity>) {
    await this.updatesRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.updatesRepository.delete(id);
  }

  async seed() {
    const updates = [
      {
        title: 'New Luxury Apartments Project Launched',
        excerpt:
          'We are excited to announce the launch of our newest residential project in Nyarutarama.',
        content: 'Full details about the project...',
        category: 'Projects',
        author: 'Admin',
        date: new Date().toISOString(),
        image: 'https://picsum.photos/seed/upd1/800/600',
        tags: ['Construction', 'Real Estate'],
      },
      {
        title: 'BSNG Wins Sustainable Building Award',
        excerpt:
          'Our commitment to eco-friendly construction has been recognized with a regional award.',
        content: 'Award details...',
        category: 'Awards',
        author: 'Management',
        date: new Date().toISOString(),
        image: 'https://picsum.photos/seed/upd2/800/600',
        tags: ['Award', 'Sustainability'],
      },
      {
        title: 'Annual Charity Gala 2024',
        excerpt:
          'Join us for our upcoming charity event to support local community development.',
        content: 'Event details...',
        category: 'Events',
        author: 'PR Team',
        date: new Date().toISOString(),
        image: 'https://picsum.photos/seed/upd3/800/600',
        tags: ['Event', 'Charity'],
      },
      {
        title: 'Expansion into East African Market',
        excerpt:
          'BSNG expands operations to Kenya and Uganda, marks a new chapter.',
        content: 'Market expansion news...',
        category: 'Company',
        author: 'CEO',
        date: new Date().toISOString(),
        image: 'https://picsum.photos/seed/upd4/800/600',
        tags: ['Expansion', 'News'],
      },
      {
        title: 'Tips for Maintaining Your New Home',
        excerpt:
          'Practical advice from our engineers on keeping your home in top shape.',
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
}
