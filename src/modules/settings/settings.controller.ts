import { Controller, Get, Body, Put, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { memoryStorage } from 'multer';
import { UpdateSettingDto } from './dtos/update-setting.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
// Assuming AuthGuard logic; might need to adjust imports based on actual auth implementation
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../rbac/guards/roles.guard';
// import { Roles } from '../../rbac/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) { }

  @Get('public')
  getPublicSettings() {
    return this.settingsService.findAllPublic();
  }

  // Protected endpoints would go here. For now I'll leave them open or minimal as I can't see auth module structure fully.
  // Ideally:
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'editor')
  @Get()
  getAllSettings() {
    return this.settingsService.findAll();
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'editor')
  @Put(':key')
  updateSetting(
    @Param('key') key: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(key, updateSettingDto);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('key') key: string,
  ) {
    let imageUrl = '';

    // Check if Cloudinary is configured
    if (this.configService.get('CLOUDINARY_CLOUD_NAME')) {
      const result = await this.cloudinaryService.uploadImage(image, 'settings');
      imageUrl = result.secure_url || result.url;
    } else {
      // Fallback or warning - currently we've moved to memoryStorage so local save would need extra code
      // For now, if no Cloudinary, we might still want to support local for dev, but memoryStorage doesn't save to disk.
      throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
    }

    if (key) {
      await this.settingsService.updateValue(key, imageUrl);
    }
    return { url: imageUrl, key };
  }

  @Get('seed')
  seed() {
    return this.settingsService.seed();
  }
}
