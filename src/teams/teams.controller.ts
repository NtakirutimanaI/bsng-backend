import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './team.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Post()
  create(@Body() teamData: Partial<Team>) {
    return this.teamsService.create(teamData);
  }
}
