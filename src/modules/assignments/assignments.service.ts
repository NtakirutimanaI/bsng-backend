import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
  ) { }

  async create(createAssignmentDto: CreateAssignmentDto) {
    const assignment = this.assignmentsRepository.create(createAssignmentDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async findAll() {
    return await this.assignmentsRepository.find({ relations: ['employee', 'site'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const assignment = await this.assignmentsRepository.findOne({ where: { id }, relations: ['employee', 'site'] });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateAssignmentDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async remove(id: string) {
    const assignment = await this.findOne(id);
    return await this.assignmentsRepository.remove(assignment);
  }
}
