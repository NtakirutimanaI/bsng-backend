import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(data: Partial<Project>): Promise<Project>;
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: Project[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Project | null>;
    update(id: string, data: Partial<Project>): Promise<Project | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    getProjectStatusCounts(): Promise<{
        status: any;
        count: number;
    }[]>;
}
