import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';

@ApiTags('updates')
@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new company update (admin)' })
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all company updates' })
  findAll() {
    return this.updatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single company update' })
  findOne(@Param('id') id: string) {
    return this.updatesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a company update record (admin)' })
  update(@Param('id') id: string, @Body() updateUpdateDto: Partial<CreateUpdateDto>) {
    return this.updatesService.update(id, updateUpdateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a company update (admin)' })
  remove(@Param('id') id: string) {
    return this.updatesService.remove(id);
  }
}
