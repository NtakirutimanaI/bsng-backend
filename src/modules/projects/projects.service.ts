import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  create(data: Partial<Project>) {
    const project = this.projectsRepository.create(data);
    return this.projectsRepository.save(project);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    status: string = 'all',
  ) {
    const queryBuilder = this.projectsRepository.createQueryBuilder('project');

    if (search) {
      queryBuilder.andWhere(
        '(project.name ILIKE :search OR project.code ILIKE :search OR project.location ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('project.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.projectsRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Project>) {
    await this.projectsRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.projectsRepository.delete(id);
  }

  async getProjectStatusCounts() {
    const raw = await this.projectsRepository
      .createQueryBuilder('project')
      .select('project.status', 'status')
      .addSelect('COUNT(project.id)', 'count')
      .groupBy('project.status')
      .getRawMany();

    // Map to standard format
    return raw.map((r) => ({
      status: r.status,
      count: parseInt(r.count, 10),
    }));
  }
}
