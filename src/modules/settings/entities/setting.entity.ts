import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'general' })
  group: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
