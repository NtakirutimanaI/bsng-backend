import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('updates')
export class UpdateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  excerpt: string;

  @Column('text')
  content: string;

  @Column()
  category: string;

  @Column()
  author: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  image: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
