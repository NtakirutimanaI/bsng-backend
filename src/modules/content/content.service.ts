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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
      let imageUrl = undefined;
      if (image) {
        const result = await this.cloudinaryService.uploadImage(image, 'content');
        imageUrl = result.secure_url || result.url;
      }

      const content = this.contentRepository.create({
        ...createContentDto,
        image: imageUrl,
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

    // Note: In Cloudinary we usually don't need to manually unlink local files
    // as we are now using memoryStorage.

    Object.assign(content, updateContentDto);

    if (image) {
      const result = await this.cloudinaryService.uploadImage(image, 'content');
      content.image = result.secure_url || result.url;
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

    // Optional: add logic to delete from Cloudinary if needed

    return this.contentRepository.remove(content);
  }
}