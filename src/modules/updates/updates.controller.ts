import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdatesService } from './updates.service';
import { UpdateEntity } from './entities/update.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Controller('updates')
export class UpdatesController {
  constructor(
    private readonly updatesService: UpdatesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  create(@Body() createUpdateDto: Partial<UpdateEntity>) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('category') category: string = '',
  ) {
    return this.updatesService.findAll(
      Number(page),
      Number(limit),
      search,
      category,
    );
  }

  @Get('seed')
  seed() {
    return this.updatesService.seed();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.updatesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUpdateDto: Partial<UpdateEntity>,
  ) {
    return this.updatesService.update(id, updateUpdateDto);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      if (!image) {
        throw new BadRequestException('No image file selected.');
      }

      if (!this.cloudinaryService.isConfigured()) {
        throw new BadRequestException('CLOUD STORAGE NOT CONFIGURED: Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your Vercel Environment Variables.');
      }

      const existingUpdate = await this.updatesService.findOne(id);
      
      // Delete old image if it's a Cloudinary one
      if (existingUpdate?.image) {
        const publicId = this.cloudinaryService.extractPublicId(existingUpdate.image);
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId).catch(err => {
            console.error(`Failed to delete old image from Cloudinary: ${err.message}`);
          });
        }
      }

      const result = await this.cloudinaryService.uploadImage(image, 'updates');
      const imageUrl = `${result.secure_url || result.url}?v=${Date.now()}`;

      await this.updatesService.update(id, { image: imageUrl });
      return { url: imageUrl, id };
    } catch (error) {
      console.error('Update Image Upload Error:', error);
      const errorMessage = error.message || (typeof error === 'string' ? error : 'Unknown upload error');
      throw new InternalServerErrorException(`Server Error: ${errorMessage}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const update = await this.updatesService.findOne(id);
    if (update?.image) {
      const publicId = this.cloudinaryService.extractPublicId(update.image);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId).catch(() => {
          console.error('Failed to delete image from Cloudinary');
        });
      }
    }
    return this.updatesService.remove(id);
  }
}

