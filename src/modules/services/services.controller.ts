import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Get('public')
    findAllPublic() {
        return this.servicesService.findAllActive();
    }

    @Post('seed')
    seed() {
        return this.servicesService.seed();
    }

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }

    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Post(':id/upload-image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: memoryStorage(),
        }),
    )
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
    ) {
        try {
            if (!image) {
                throw new BadRequestException('No image file selected.');
            }

            const service = await this.servicesService.findOne(id);
            
            // Delete old image if it's a Cloudinary one
            if (service?.image) {
                const publicId = this.cloudinaryService.extractPublicId(service.image);
                if (publicId) {
                    await this.cloudinaryService.deleteImage(publicId).catch(err => {
                        console.error(`Failed to delete old image from Cloudinary: ${err.message}`);
                    });
                }
            }

            const result = await this.cloudinaryService.uploadImage(image, 'services');
            const imageUrl = result.secure_url || result.url;

            await this.servicesService.update(id, { image: imageUrl });
            return { url: imageUrl, id };
        } catch (error) {
            console.error('Service Upload Error:', error);
            throw new InternalServerErrorException(error.message || 'Failed to upload service image.');
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const service = await this.servicesService.findOne(id);
        if (service?.image) {
            const publicId = this.cloudinaryService.extractPublicId(service.image);
            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId).catch(() => {});
            }
        }
        return this.servicesService.remove(id);
    }
}
