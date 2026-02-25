import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentService {
    private readonly contentRepository;
    constructor(contentRepository: Repository<Content>);
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: Content[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublic(section?: string): Promise<Content[]>;
    findOne(id: string): Promise<Content>;
    create(createContentDto: CreateContentDto, image?: Express.Multer.File): Promise<Content>;
    update(id: string, updateContentDto: UpdateContentDto, image?: Express.Multer.File): Promise<Content>;
    toggleStatus(id: string, isActive: boolean): Promise<Content>;
    remove(id: string): Promise<Content>;
}
