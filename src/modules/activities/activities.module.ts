import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity.entity';
import { ActivitiesService } from './activities.service';

@Global() // Making it global so other modules can use it easily
@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog])],
    providers: [ActivitiesService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
