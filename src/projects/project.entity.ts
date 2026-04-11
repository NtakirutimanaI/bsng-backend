import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Site } from '../sites/site.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  client: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  completionDate: string;

  @Column({ nullable: true })
  imagePath: string;

  @ManyToOne(() => Site, site => site.projects, { nullable: true, eager: true, onDelete: 'SET NULL' })
  site: Site;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
