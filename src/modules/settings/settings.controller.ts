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
    try {
      if (!image) {
        return { success: false, message: 'No image file provided in request.' };
      }

      if (key) {
        const existingSettings = await this.settingsService.findAll();
        const currentSetting = existingSettings.find(s => s.key === key);
        
        if (currentSetting?.value) {
          const publicId = this.cloudinaryService.extractPublicId(currentSetting.value);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId).catch(err => {
              console.error(`Failed to delete old image from Cloudinary: ${err.message}`);
            });
          }
        }
      }

      const result = await this.cloudinaryService.uploadImage(image, 'settings');
      const imageUrl = result.secure_url || result.url;

      if (key) {
        await this.settingsService.updateValue(key, imageUrl);
      }
      return { success: true, url: imageUrl, key };
    } catch (error) {
      console.error('Upload Error:', error);
      return { 
        success: false, 
        message: error.message || 'Unknown server error during upload',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }
  
  @Post('sync-github')
  async syncGithub() {
    try {
      const frontendDir = path.join(process.cwd(), '../bsng-frontend');
      const backendDir = process.cwd();

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
