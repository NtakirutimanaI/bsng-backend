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
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  create(@Body() createPropertyDto: Partial<Property>) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('type') type: string = 'all',
    @Query('status') status: string = 'all',
    @Query('isForSale') isForSale?: string,
    @Query('isForRent') isForRent?: string,
  ) {
    return this.propertiesService.findAll(
      Number(page),
      Number(limit),
      search,
      type,
      status,
      isForSale,
      isForRent,
    );
  }

  @Get('seed')
  seed() {
    return this.propertiesService.seed();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: Partial<Property>,
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
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
    @Body('field') field: string,
  ) {
    let imageUrl = '';
    if (this.configService.get('CLOUDINARY_CLOUD_NAME')) {
      const result = await this.cloudinaryService.uploadImage(image, 'properties');
      imageUrl = result.secure_url || result.url;
    } else {
      throw new Error('Cloudinary is not configured');
    }

    const validFields = ['image', 'image2', 'image3'];
    const updateField = validFields.includes(field) ? field : 'image';
    await this.propertiesService.update(id, { [updateField]: imageUrl });
    return { url: imageUrl, id, field: updateField };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
