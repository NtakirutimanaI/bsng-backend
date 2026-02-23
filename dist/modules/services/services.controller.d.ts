import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAllPublic(): Promise<import("./entities/service.entity").Service[]>;
    seed(): Promise<{
        message: string;
        count?: undefined;
    } | {
        message: string;
        count: number;
    }>;
    findAll(): Promise<import("./entities/service.entity").Service[]>;
    findOne(id: string): Promise<import("./entities/service.entity").Service>;
    create(createServiceDto: CreateServiceDto): Promise<import("./entities/service.entity").Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("./entities/service.entity").Service>;
    remove(id: string): Promise<import("./entities/service.entity").Service>;
}
