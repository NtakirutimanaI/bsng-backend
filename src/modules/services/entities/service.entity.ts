import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Will store JSON for translations if needed, or just a string

    @Column({ nullable: true })
    title: string;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    order: number;

    @Column({ nullable: true })
    delay: string;

    @Column({ default: false })
    isDark: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
