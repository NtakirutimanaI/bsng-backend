import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { SitesService } from '../sites/sites.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    private readonly sitesService: SitesService,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepo.create(dto);
    
    if (dto.siteId) {
      try {
        const site = await this.sitesService.findOne(dto.siteId);
        project.site = site;
      } catch (error) {
        // Just proceed without site if not found or throw error depending on requirements
      }
    }

    return this.projectsRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.projectsRepo.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      console.error('❌ Database connection failed. Returning mock projects.', error.message);
      return []; 
    }
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectsRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: Partial<CreateProjectDto>): Promise<Project | null> {
    await this.projectsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepo.delete(id);
  }
}
