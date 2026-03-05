import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_name' })
    userName: string;

    @Column({ name: 'user_email' })
    userEmail: string;

    @Column()
    action: string; // e.g. 'Created Project', 'Paid Salary', 'Recorded Attendance'

    @Column({ nullable: true })
    target: string; // e.g. Project Name, Employee Name

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // for extra details

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
