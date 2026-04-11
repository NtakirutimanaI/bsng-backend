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
import { SponsorsService } from './sponsors.service';
import { Sponsor } from './entities/sponsor.entity';

@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Post()
  create(@Body() createSponsorDto: Partial<Sponsor>) {
    return this.sponsorsService.create(createSponsorDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('type') type: string = 'all',
  ) {
    return this.sponsorsService.findAll(
      Number(page),
      Number(limit),
      search,
      type,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsorsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSponsorDto: Partial<Sponsor>) {
    return this.sponsorsService.update(id, updateSponsorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsorsService.remove(id);
  }
}
