import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: import("./entities/content.entity").Content[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findPublic(section?: string): Promise<import("./entities/content.entity").Content[]>;
    findOne(id: string): Promise<import("./entities/content.entity").Content>;
    create(createContentDto: CreateContentDto, image?: Express.Multer.File): Promise<import("./entities/content.entity").Content>;
    update(id: string, updateContentDto: UpdateContentDto, image?: Express.Multer.File): Promise<import("./entities/content.entity").Content>;
    toggleStatus(id: string, isActive: boolean): Promise<import("./entities/content.entity").Content>;
    uploadImage(image: Express.Multer.File, contentId: string): Promise<{
        url: string;
        contentId: string;
    }>;
    remove(id: string): Promise<import("./entities/content.entity").Content>;
}
