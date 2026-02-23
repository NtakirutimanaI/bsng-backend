import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { UpdateEntity } from './entities/update.entity';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  create(@Body() createUpdateDto: Partial<UpdateEntity>) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('category') category: string = '',
  ) {
    return this.updatesService.findAll(
      Number(page),
      Number(limit),
      search,
      category,
    );
  }

  @Get('seed')
  seed() {
    return this.updatesService.seed();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.updatesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUpdateDto: Partial<UpdateEntity>,
  ) {
    return this.updatesService.update(id, updateUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.updatesService.remove(id);
  }
}
