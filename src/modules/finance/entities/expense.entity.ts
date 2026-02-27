import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: string;

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    @Column({ default: 'RWF' })
    currency: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ nullable: true })
    projectId: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 'paid' })
    status: string; // pending, paid, approved, rejected

    @Column({ nullable: true })
    recordedBy: string;

    @Column({ nullable: true })
    approvedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
