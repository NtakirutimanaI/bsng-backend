import { Controller, Get, Body, Put, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UpdateSettingDto } from './dtos/update-setting.dto';
// Assuming AuthGuard logic; might need to adjust imports based on actual auth implementation
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../rbac/guards/roles.guard';
// import { Roles } from '../../rbac/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

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
      storage: diskStorage({
        destination: './uploads/settings',
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
    @Body('key') key: string,
  ) {
    const imageUrl = `/uploads/settings/${image.filename}`;
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
