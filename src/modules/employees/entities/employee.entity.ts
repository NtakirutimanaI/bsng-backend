import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';
import { Site } from '../../sites/entities/site.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  siteId: string;

  @ManyToOne(() => Site, (site) => site.employees, { nullable: true })
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column({ unique: true })
  employeeId: string;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendanceHistory: Attendance[];

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @Column({ type: 'date' })
  hireDate: string;

  @Column()
  salaryType: string;

  @Column('decimal', { precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'int', default: 0 })
  attendance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
