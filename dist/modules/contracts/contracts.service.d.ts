import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
export declare class ContractsService {
    private contractsRepository;
    constructor(contractsRepository: Repository<Contract>);
    create(createContractDto: CreateContractDto): Promise<Contract>;
    findAll(): Promise<Contract[]>;
    findOne(id: string): Promise<Contract>;
    update(id: string, updateContractDto: UpdateContractDto): Promise<Contract>;
    remove(id: string): Promise<Contract>;
}
