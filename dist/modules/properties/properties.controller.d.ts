import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: Partial<Property>): Promise<Property>;
    findAll(page?: number, limit?: number, search?: string, type?: string, status?: string, isForSale?: string, isForRent?: string): Promise<{
        data: Property[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
    findOne(id: string): Promise<Property | null>;
    update(id: string, updatePropertyDto: Partial<Property>): Promise<Property | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
