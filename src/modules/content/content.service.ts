import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { unlink } from 'fs/promises';
import { File } from 'multer';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async findAll(page = 1, limit = 10, search?: string, category?: string) {
    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .orderBy('content.order', 'ASC')
      .addOrderBy('content.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        '(content.title ILIKE :search OR content.description ILIKE :search OR content.section ILIKE :search)',
        { search: `%${search}%` }
      );
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

  async findPublic(section?: string) {
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

  async findOne(id: string) {
    return this.contentRepository.findOne({ where: { id } });
  }

  async create(createContentDto: CreateContentDto, image?: File) {
    const content = this.contentRepository.create({
      ...createContentDto,
      image: image ? `/uploads/content/${image.filename}` : undefined,
    });

    return this.contentRepository.save(content);
  }

  async update(id: string, updateContentDto: UpdateContentDto, image?: File) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new Error('Content not found');
    }

    // Delete old image if new one is uploaded
    if (image && content.image) {
      try {
        await unlink(`.${content.image}`);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    Object.assign(content, updateContentDto);
    if (image) {
      content.image = `/uploads/content/${image.filename}`;
    }

    return this.contentRepository.save(content);
  }

  async toggleStatus(id: string, isActive: boolean) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new Error('Content not found');
    }

    content.isActive = isActive;
    return this.contentRepository.save(content);
  }

  async remove(id: string) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new Error('Content not found');
    }

    // Delete associated image
    if (content.image) {
      try {
        await unlink(`.${content.image}`);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    return this.contentRepository.remove(content);
  }
}
