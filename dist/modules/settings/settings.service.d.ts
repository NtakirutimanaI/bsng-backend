import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dtos/update-setting.dto';
export declare class SettingsService {
    private settingsRepository;
    constructor(settingsRepository: Repository<Setting>);
    findAllPublic(): Promise<Setting[]>;
    findAll(): Promise<Setting[]>;
    findOne(key: string): Promise<Setting>;
    createOrUpdate(key: string, value: string, group?: string, description?: string, isPublic?: boolean): Promise<Setting>;
    update(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting>;
    updateValue(key: string, value: string): Promise<Setting>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
}
