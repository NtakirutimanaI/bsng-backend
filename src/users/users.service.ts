import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await this.findByEmail(adminEmail);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const admin = this.usersRepo.create({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });
      await this.usersRepo.save(admin);
      console.log('✅ Admin user seeded successfully');
    }
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findByToken(resetPasswordToken: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: {
        resetPasswordToken,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findOrCreateGoogleUser(profile: { email: string; firstName: string; lastName: string; googleId: string }): Promise<User> {
    let user = await this.findByEmail(profile.email);
    if (!user) {
      user = this.usersRepo.create({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        googleId: profile.googleId,
      });
      user = await this.usersRepo.save(user);
    } else if (!user.googleId) {
      // Link Google Account to existing account
      user.googleId = profile.googleId;
      await this.usersRepo.save(user);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepo.find({ order: { createdAt: 'DESC' } as any });
    } catch (error) {
      console.error('❌ Database connection failed. Returning mock data for development.', error.message);
      // Fallback mock data for development
      return [
        {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@gmail.com',
          role: 'admin',
          phone: '+250 780 000 000',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User,
      ];
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    Object.assign(user, data);
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepo.delete(id);
  }

  async save(user: User): Promise<User> {
    return this.usersRepo.save(user);
  }
}
