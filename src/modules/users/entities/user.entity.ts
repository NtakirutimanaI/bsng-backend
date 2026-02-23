import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../rbac/entities/role.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SITE_MANAGER = 'site_manager',
  EDITOR = 'editor',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
  AUDITOR = 'auditor',
  GENERAL_USER = 'general_user',
  PARTNER = 'partner',
  DONOR = 'donor',
  BENEFICIARY = 'beneficiary',
  VOLUNTEER = 'volunteer',
  CONSULTANT = 'consultant',
  ACCOUNTANT = 'accountant',
  HR = 'hr',
  INVESTOR = 'investor',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  passwordHash: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ name: 'role_id', nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    name: 'user_role',
    type: 'enum',
    enum: UserRole,
  })
  userRole: UserRole;

  @Column({ length: 10, default: 'en' })
  language: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 50, default: 'UTC' })
  timezone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'reset_token', length: 255, nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_expires', type: 'timestamp', nullable: true })
  resetTokenExpires: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
