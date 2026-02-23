import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
export declare class PropertiesService {
    private propertiesRepository;
    constructor(propertiesRepository: Repository<Property>);
    create(data: Partial<Property>): Promise<Property>;
    findAll(page?: number, limit?: number, search?: string, type?: string, status?: string, isForSale?: string, isForRent?: string): Promise<{
        data: Property[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Property | null>;
    update(id: string, data: Partial<Property>): Promise<Property | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    seed(): Promise<{
        message: string;
        count: number;
    }>;
}
