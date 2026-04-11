import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';

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
    siteId: string;

    @ManyToOne(() => Site, { nullable: true })
    @JoinColumn({ name: 'siteId' })
    site: Site;

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
