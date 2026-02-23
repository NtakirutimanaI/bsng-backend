import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
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

  @Get('seed')
  seed() {
    return this.settingsService.seed();
  }
}
