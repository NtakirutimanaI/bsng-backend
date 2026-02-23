import { Repository } from 'typeorm';
import { UpdateEntity } from './entities/update.entity';
export declare class UpdatesService {
    private updatesRepository;
    constructor(updatesRepository: Repository<UpdateEntity>);
    create(data: Partial<UpdateEntity>): Promise<UpdateEntity>;
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: UpdateEntity[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<UpdateEntity | null>;
    update(id: string, data: Partial<UpdateEntity>): Promise<UpdateEntity | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
}
