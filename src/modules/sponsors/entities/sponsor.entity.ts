import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sponsors')
export class Sponsor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'contact_person' })
  contactPerson: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('numeric', { name: 'investment_amount' })
  investmentAmount: number;

  @Column({ name: 'investment_date', type: 'date' })
  investmentDate: string;

  @Column()
  status: string;

  @Column('int')
  projects: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
