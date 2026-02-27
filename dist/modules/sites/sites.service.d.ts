import { Repository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
export declare class SitesService {
    private sitesRepository;
    constructor(sitesRepository: Repository<Site>);
    create(createSiteDto: CreateSiteDto): Promise<Site>;
    findAll(): Promise<Site[]>;
    findOne(id: string): Promise<Site>;
    update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site>;
    remove(id: string): Promise<Site>;
}
