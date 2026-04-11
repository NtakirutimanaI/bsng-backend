import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardTask } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(DashboardTask)
    private tasksRepository: Repository<DashboardTask>,
  ) {}

  async findAll(userId?: string, role?: string) {
    const query = this.tasksRepository.createQueryBuilder('task');
    
    if (userId) {
      query.where('task.userId = :userId', { userId });
    } else if (role) {
      query.where('task.role = :role', { role });
    }

    return query.orderBy('task.createdAt', 'DESC').getMany();
  }

  async create(data: Partial<DashboardTask>) {
    const task = this.tasksRepository.create(data);
    return this.tasksRepository.save(task);
  }

  async update(id: string, data: Partial<DashboardTask>) {
    await this.tasksRepository.update(id, data);
    return this.tasksRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    return this.tasksRepository.delete(id);
  }
}
