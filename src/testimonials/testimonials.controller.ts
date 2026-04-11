import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './testimonial.entity';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Testimonial>) {
    return this.testimonialsService.create(data);
  }
}
