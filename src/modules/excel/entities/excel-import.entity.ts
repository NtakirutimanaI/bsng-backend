import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('excel_imports')
export class ExcelImport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  filename: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'import_type', length: 50 })
  importType: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'total_records', default: 0 })
  totalRecords: number;

  @Column({ name: 'success_records', default: 0 })
  successRecords: number;

  @Column({ name: 'failed_records', default: 0 })
  failedRecords: number;

  @Column({ type: 'jsonb', nullable: true })
  errors: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
