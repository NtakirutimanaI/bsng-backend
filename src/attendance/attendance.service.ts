import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const user = await this.userRepository.findOne({ where: { id: createAttendanceDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${createAttendanceDto.userId} not found`);
    }

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      user,
    });

    return this.attendanceRepository.save(attendance);
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      order: { date: 'DESC' }
    });
  }

  async findByDate(date: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { date },
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    
    if (updateAttendanceDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateAttendanceDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateAttendanceDto.userId} not found`);
      }
      attendance.user = user;
    }

    Object.assign(attendance, updateAttendanceDto);

    return this.attendanceRepository.save(attendance);
  }

  async remove(id: string): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }
}
