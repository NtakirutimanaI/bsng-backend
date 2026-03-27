import { Controller, Get, Body, Put, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { memoryStorage } from 'multer';
import { UpdateSettingDto } from './dtos/update-setting.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

  @Get()
  getAllSettings() {
    return this.settingsService.findAll();
  }

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
    const isCloudinaryConfigured = this.configService.get('CLOUDINARY_CLOUD_NAME') && this.configService.get('CLOUDINARY_CLOUD_NAME') !== 'your_cloud_name';

    if (isCloudinaryConfigured) {
      const result = await this.cloudinaryService.uploadImage(image, 'settings');
      imageUrl = result.secure_url || result.url;
    } else {
      // Create local fallback, saving to frontend's public directory
      const ext = path.extname(image.originalname);
      const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'img', 'custom');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, image.buffer);
      imageUrl = `/img/custom/${filename}`;
    }

    if (key) {
      await this.settingsService.updateValue(key, imageUrl);
    }
    return { url: imageUrl, key };
  }
  
  @Post('sync-github')
  async syncGithub() {
    try {
      const frontendDir = path.join(__dirname, '../../../../../bsng-frontend');
      const backendDir = path.join(__dirname, '../../../../../bsng-backend');

      for (const repoDir of [frontendDir, backendDir]) {
        if (!fs.existsSync(repoDir)) continue;
        await execAsync('git config --global user.email "admin@bsng.org" || true', { cwd: repoDir });
        await execAsync('git config --global user.name "BSNG Admin" || true', { cwd: repoDir });
        await execAsync('git add .', { cwd: repoDir });
        try {
          await execAsync('git commit -m "Auto-update website content via CMS"', { cwd: repoDir });
          await execAsync('git push origin main', { cwd: repoDir });
        } catch (commitErr) {
           // Nothing to commit
        }
      }
      return { success: true, message: 'Synced both frontend and backend to Github' };
    } catch (error) {
      console.error('Github Sync Error:', error);
      return { success: false, error: 'Failed to sync with Github' };
    }
  }

  @Get('seed')
  seed() {
    return this.settingsService.seed();
  }

  @Post('reset-carousel')
  async resetCarousel() {
    await this.settingsService.updateValue('home_carousel_1', '/img/hero-slider-1.jpg');
    await this.settingsService.updateValue('home_carousel_2', '/img/hero-slider-2.jpg');
    await this.settingsService.updateValue('home_carousel_3', '/img/hero-slider-3.jpg');
    return { success: true, message: 'Hero carousel images reset to defaults.' };
  }
}
