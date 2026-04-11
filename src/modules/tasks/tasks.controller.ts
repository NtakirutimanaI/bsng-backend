import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DashboardTask } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Req() req, @Query('role') role?: string) {
    return this.tasksService.findAll(req.user.id, role);
  }

  @Post()
  async create(@Req() req, @Body() data: Partial<DashboardTask>) {
    return this.tasksService.create({ ...data, userId: req.user.id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<DashboardTask>) {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
