import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Site } from '../../sites/entities/site.entity';

@Entity('assignments')
export class Assignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    employeeId: string;

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column()
    siteId: string;

    @ManyToOne(() => Site)
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @Column()
    role: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
