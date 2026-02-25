import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  // ✅ ADMIN LIST WITH PAGINATION + SEARCH
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    category?: string,
  ) {
    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .orderBy('content.order', 'ASC')
      .addOrderBy('content.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        `(content.title ILIKE :search 
          OR content.description ILIKE :search 
          OR content.section ILIKE :search)`,
        { search: `%${search}%` },
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

  // ✅ PUBLIC CONTENT (ACTIVE ONLY)
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

  // ✅ FIND SINGLE
  async findOne(id: string) {
    const content = await this.contentRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  // ✅ CREATE
  async create(
    createContentDto: CreateContentDto,
    image?: Express.Multer.File,
  ) {
    try {
      const content = this.contentRepository.create({
        ...createContentDto,
        image: image
          ? `/uploads/content/${image.filename}`
          : undefined,
      });

      return await this.contentRepository.save(content);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create content',
      );
    }
  }

  // ✅ UPDATE
  async update(
    id: string,
    updateContentDto: UpdateContentDto,
    image?: Express.Multer.File,
  ) {
    const content = await this.findOne(id);

    // Delete old image if new one uploaded
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

  // ✅ TOGGLE STATUS
  async toggleStatus(id: string, isActive: boolean) {
    const content = await this.findOne(id);

    content.isActive = isActive;

    return this.contentRepository.save(content);
  }

  // ✅ DELETE
  async remove(id: string) {
    const content = await this.findOne(id);

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