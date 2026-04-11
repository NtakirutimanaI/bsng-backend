import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string; // Relation by ID string or we can use join

  @ManyToOne(() => Employee, (employee) => employee.attendanceHistory)
  @JoinColumn({ name: 'employee_record_id' })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column()
  status: string; // Present, Late, Absent, Leave

  @Column({ nullable: true })
  checkIn: string; // Time

  @Column({ nullable: true })
  checkOut: string; // Time

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  workingHours: number;

  @Column({ nullable: true })
  reason: string; // Notes

  @CreateDateColumn()
  createdAt: Date;
}
