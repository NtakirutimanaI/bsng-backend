import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) { }

  async create(createContractDto: CreateContractDto) {
    const contract = this.contractsRepository.create(createContractDto);
    return await this.contractsRepository.save(contract);
  }

  async findAll() {
    return await this.contractsRepository.find({ relations: ['employee'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const contract = await this.contractsRepository.findOne({ where: { id }, relations: ['employee'] });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.findOne(id);
    Object.assign(contract, updateContractDto);
    return await this.contractsRepository.save(contract);
  }

  async remove(id: string) {
    const contract = await this.findOne(id);
    return await this.contractsRepository.remove(contract);
  }
}
