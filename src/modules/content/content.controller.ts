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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

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
      storage: diskStorage({
        destination: './uploads/content',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${randomName}${fileExt}`);
        },
      }),
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
      storage: diskStorage({
        destination: './uploads/content',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${randomName}${fileExt}`);
        },
      }),
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
      storage: diskStorage({
        destination: './uploads/content',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${randomName}${fileExt}`);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('contentId') contentId: string,
  ) {
    const imageUrl = `/uploads/content/${image.filename}`;
    return { url: imageUrl, contentId };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}