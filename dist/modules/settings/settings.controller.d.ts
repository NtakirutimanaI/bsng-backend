import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dtos/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<import("./entities/setting.entity").Setting[]>;
    getAllSettings(): Promise<import("./entities/setting.entity").Setting[]>;
    updateSetting(key: string, updateSettingDto: UpdateSettingDto): Promise<import("./entities/setting.entity").Setting>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
}
