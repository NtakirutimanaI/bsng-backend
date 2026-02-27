import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('income')
export class Income {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    source: string;

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

    @Column({ default: 'received' })
    status: string;

    @Column({ nullable: true })
    recordedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
