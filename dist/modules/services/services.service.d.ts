import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
export declare class ServicesService {
    private servicesRepository;
    constructor(servicesRepository: Repository<Service>);
    findAll(): Promise<Service[]>;
    findAllActive(): Promise<Service[]>;
    findOne(id: string): Promise<Service>;
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    remove(id: string): Promise<Service>;
    seed(): Promise<{
        message: string;
        count?: undefined;
    } | {
        message: string;
        count: number;
    }>;
}
