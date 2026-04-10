import { Controller, Get, Body, Put, Param, Post, UploadedFile, UseInterceptors, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
        throw new BadRequestException('No image file selected.');
      }

      const result = await this.cloudinaryService.uploadImage(image, 'settings');
      const imageUrl = result.secure_url || result.url;

      if (!imageUrl) {
        throw new Error('Upload succeeded but no URL was returned from Cloudinary.');
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
        await this.settingsService.updateValue(key, imageUrl);
      }
      return { url: imageUrl, key };
    } catch (error) {
      console.error('Core Settings Upload Error:', error);
      const errorMessage = error.message || (typeof error === 'string' ? error : 'Unknown upload error');
      throw new InternalServerErrorException(`Server Error: ${errorMessage}`);
    }
  }
  
  @Post('sync-github')
  async syncGithub() {
    try {
      // Vercel check: skip git sync as it's not supported and causes timeouts
      if (process.env.VERCEL) {
        return { success: true, message: 'Settings saved to database. Git sync skipped on Vercel environment.' };
      }

      const backendDir = process.cwd();
      const frontendDir = path.resolve(backendDir, '..', 'bsng-frontend');
      
      const results = [];
      for (const repoDir of [frontendDir, backendDir]) {
        if (!fs.existsSync(repoDir) || !fs.existsSync(path.join(repoDir, '.git'))) {
           results.push({ dir: path.basename(repoDir), status: 'skipped (no git)' });
           continue;
        }

        try {
          await execAsync('git config user.email "admin@bsng.org" || true', { cwd: repoDir });
          await execAsync('git config user.name "BSNG Admin" || true', { cwd: repoDir });
          await execAsync('git add .', { cwd: repoDir });
          
          // Check if there are changes to commit
          const { stdout: status } = await execAsync('git status --porcelain', { cwd: repoDir });
          if (!status.trim()) {
            results.push({ dir: path.basename(repoDir), status: 'no changes' });
            continue;
          }

          await execAsync('git commit -m "Auto-update website content via CMS"', { cwd: repoDir });
          await execAsync('git push origin main', { cwd: repoDir });
          results.push({ dir: path.basename(repoDir), status: 'success' });
        } catch (commitErr) {
          results.push({ dir: path.basename(repoDir), status: 'error', details: commitErr.message });
        }
      }
      return { success: true, message: 'Sync process completed', results };
    } catch (error) {
      console.error('Github Sync Error:', error);
      return { success: false, error: error.message || 'Failed to sync with Github' };
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
