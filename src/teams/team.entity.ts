import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  facebookUrl: string;

  @Column({ nullable: true })
  twitterUrl: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;
}
