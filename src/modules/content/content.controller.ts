import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.contentService.findAll(page, limit, search, category);
  }

  @Get('public')
  async findPublic(@Query('section') section?: string) {
    return this.contentService.findPublic(section);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async create(
    @Body() createContentDto: CreateContentDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.contentService.create(createContentDto, image);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.contentService.update(id, updateContentDto, image);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.contentService.toggleStatus(id, isActive);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('contentId') contentId: string,
  ) {
    let imageUrl = '';
    if (this.configService.get('CLOUDINARY_CLOUD_NAME')) {
      const result = await this.cloudinaryService.uploadImage(image, 'content');
      imageUrl = result.secure_url || result.url;
    } else {
      throw new Error('Cloudinary is not configured');
    }

    return { url: imageUrl, contentId };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}