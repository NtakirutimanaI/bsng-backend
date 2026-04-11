import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  location: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column()
  budget: string;

  @Column({ name: 'actual_cost' })
  actualCost: string;

  @Column()
  manager: string;

  @Column()
  client: string;

  @Column('int')
  progress: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'site_id', nullable: true })
  siteId: string;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  gallery: string[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
