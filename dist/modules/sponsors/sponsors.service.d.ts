import { Repository } from 'typeorm';
import { Sponsor } from './entities/sponsor.entity';
export declare class SponsorsService {
    private sponsorsRepository;
    constructor(sponsorsRepository: Repository<Sponsor>);
    create(data: Partial<Sponsor>): Promise<Sponsor>;
    findAll(page?: number, limit?: number, search?: string, type?: string): Promise<{
        data: Sponsor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Sponsor | null>;
    update(id: string, data: Partial<Sponsor>): Promise<Sponsor | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
