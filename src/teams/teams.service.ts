import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  findOne(id: number): Promise<Team | null> {
    return this.teamRepository.findOneBy({ id });
  }

  async create(teamData: Partial<Team>): Promise<Team> {
    const team = this.teamRepository.create(teamData);
    return this.teamRepository.save(team);
  }
}
