import { UpdatesService } from './updates.service';
import { UpdateEntity } from './entities/update.entity';
export declare class UpdatesController {
    private readonly updatesService;
    constructor(updatesService: UpdatesService);
    create(createUpdateDto: Partial<UpdateEntity>): Promise<UpdateEntity>;
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: UpdateEntity[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
    findOne(id: string): Promise<UpdateEntity | null>;
    update(id: string, updateUpdateDto: Partial<UpdateEntity>): Promise<UpdateEntity | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
