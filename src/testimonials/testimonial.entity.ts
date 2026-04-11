import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientName: string;

  @Column()
  serviceName: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;
}
