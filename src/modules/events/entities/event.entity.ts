import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    type: string; // meeting | deadline | inspection | delivery

    @Column({ type: 'date' })
    date: string;

    @Column()
    time: string;

    @Column({ nullable: true })
    location: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: false })
    isPublished: boolean;

    @Column({ nullable: true })
    project: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
