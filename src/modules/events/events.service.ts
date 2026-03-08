import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(EventEntity)
        private eventsRepository: Repository<EventEntity>,
    ) { }

    create(data: Partial<EventEntity>) {
        const event = this.eventsRepository.create(data);
        return this.eventsRepository.save(event);
    }

    findAll(isPublishedOnly: boolean = false) {
        if (isPublishedOnly) {
            return this.eventsRepository.find({
                where: { isPublished: true },
                order: { date: 'ASC', time: 'ASC' },
            });
        }
        return this.eventsRepository.find({
            order: { date: 'ASC', time: 'ASC' },
        });
    }

    findOne(id: string) {
        return this.eventsRepository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<EventEntity>) {
        await this.eventsRepository.update(id, data);
        return this.findOne(id);
    }

    remove(id: string) {
        return this.eventsRepository.delete(id);
    }

    async seed() {
        const events = [
            {
                title: "Project Kickoff Meeting",
                type: "meeting",
                date: "2024-02-15",
                time: "10:00 AM",
                location: "BSNG Head Office",
                project: "Kigali Heights Tower",
                description: "Initial project planning and requirements gathering",
                isPublished: true
            },
            {
                title: "Site Inspection",
                type: "inspection",
                date: "2024-02-18",
                time: "2:00 PM",
                location: "Green Valley, Musanze",
                project: "Green Valley Estates",
                description: "Monthly progress inspection and quality check",
                isPublished: true
            }
        ];

        for (const e of events) {
            const existing = await this.eventsRepository.findOne({
                where: { title: e.title, date: e.date },
            });
            if (!existing) {
                await this.eventsRepository.save(this.eventsRepository.create(e));
            }
        }
    }
}
