import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UpdatesService } from './updates.service';
import { UpdateEntity } from './entities/update.entity';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) { }

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

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/updates',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${randomName}${fileExt}`);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/updates/${image.filename}`;
    await this.updatesService.update(id, { image: imageUrl });
    return { url: imageUrl, id };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.updatesService.remove(id);
  }
}

