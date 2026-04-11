import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './testimonial.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialRepository: Repository<Testimonial>,
  ) {}

  findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find();
  }

  findOne(id: number): Promise<Testimonial | null> {
    return this.testimonialRepository.findOneBy({ id });
  }

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const testimonial = this.testimonialRepository.create(data);
    return this.testimonialRepository.save(testimonial);
  }
}
