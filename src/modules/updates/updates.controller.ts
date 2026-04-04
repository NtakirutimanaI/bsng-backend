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
    const imageUrl = result.secure_url || result.url;

    await this.updatesService.update(id, { image: imageUrl });
    return { url: imageUrl, id };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const update = await this.updatesService.findOne(id);
    if (update?.image) {
      const publicId = this.cloudinaryService.extractPublicId(update.image);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId).catch(() => {});
      }
    }
    return this.updatesService.remove(id);
  }
}

