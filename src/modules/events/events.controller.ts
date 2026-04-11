import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    create(@Body() data: any) {
        return this.eventsService.create(data);
    }

    @Get()
    findAll(@Query('public') isPublic: string) {
        return this.eventsService.findAll(isPublic === 'true');
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.eventsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }

    @Post('seed')
    seed() {
        return this.eventsService.seed();
    }
}
