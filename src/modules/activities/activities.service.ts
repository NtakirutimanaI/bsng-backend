import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(ActivityLog)
        private activitiesRepository: Repository<ActivityLog>,
    ) { }

    async create(data: Partial<ActivityLog>) {
        const log = this.activitiesRepository.create(data);
        return this.activitiesRepository.save(log);
    }

    async findAll(limit: number = 10, offset: number = 0) {
        const [data, total] = await this.activitiesRepository.findAndCount({
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return { data, total };
    }
}
