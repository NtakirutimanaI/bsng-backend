import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: Partial<Project>): Promise<Project>;
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: Project[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<Project | null>;
    update(id: string, updateProjectDto: Partial<Project>): Promise<Project | null>;
    partialUpdate(id: string, updateProjectDto: Partial<Project>): Promise<Project | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
