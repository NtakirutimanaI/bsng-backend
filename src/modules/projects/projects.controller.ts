import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  HttpException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: Partial<Project>) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('status') status: string = 'all',
  ) {
    try {
      return await this.projectsService.findAll(
        Number(page),
        Number(limit),
        search,
        status,
      );
    } catch (error: any) {
      console.error('FIND ALL Projects Error:', error);
      require('fs').writeFileSync('test_err2.txt', error.stack || error.message || JSON.stringify(error));
      throw new HttpException(error.message || 'Error', 500);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: Partial<Project>) {
    try {
      return await this.projectsService.update(id, updateProjectDto);
    } catch (error: any) {
      console.error('PUT Project Error:', error);
      throw new HttpException(error.message || 'Error', 500);
    }
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateProjectDto: Partial<Project>,
  ) {
    try {
      return await this.projectsService.update(id, updateProjectDto);
    } catch (error: any) {
      console.error('PATCH Project Error:', error);
      throw new HttpException(error.message || 'Error', 500);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
