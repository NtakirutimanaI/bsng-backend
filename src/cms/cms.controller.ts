import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CmsService } from './cms.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cms')
export class CmsController {
  constructor(
    private readonly cmsService: CmsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get(':page')
  async getPageData(@Param('page') page: string) {
    return this.cmsService.getPageData(page);
  }

  @Post(':page/update')
  @UseGuards(JwtAuthGuard)
  async updateTextContent(
    @Param('page') page: string,
    @Body() body: { section: string; key: string; value: string },
  ) {
    return this.cmsService.updateContent(page, body.section, body.key, body.value, false);
  }

  @Post(':page/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageContent(
    @Param('page') page: string,
    @Body('section') section: string,
    @Body('key') key: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadFile(file);
    return this.cmsService.updateContent(page, section, key, result.secure_url, true);
  }

  @Post(':page/bulk-update')
  @UseGuards(JwtAuthGuard)
  async bulkUpdate(
    @Param('page') page: string,
    @Body() data: Record<string, any>,
  ) {
    await this.cmsService.bulkUpdate(page, data);
    return { success: true };
  }
}
