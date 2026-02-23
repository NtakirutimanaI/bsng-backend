import { SponsorsService } from './sponsors.service';
import { Sponsor } from './entities/sponsor.entity';
export declare class SponsorsController {
    private readonly sponsorsService;
    constructor(sponsorsService: SponsorsService);
    create(createSponsorDto: Partial<Sponsor>): Promise<Sponsor>;
    findAll(page?: number, limit?: number, search?: string, type?: string): Promise<{
        data: Sponsor[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Sponsor | null>;
    update(id: string, updateSponsorDto: Partial<Sponsor>): Promise<Sponsor | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
