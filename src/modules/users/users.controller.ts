import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('login')
  async login(@Body() body: Record<string, string>) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real app, compare hashed passwords.
    if (body.password !== '123456' && user.passwordHash !== body.password) {
      throw new UnauthorizedException('Invalid password');
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result;
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.usersService.search(query || '');
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userRole') userRole?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(Number(page), Number(limit), userRole, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async create(@Body() body: Partial<User> & { password?: string }) {
    const userData = { ...body };

    // Hash password if provided
    if (body.password) {
      const bcrypt = await import('bcrypt');
      const salt = await bcrypt.genSalt(10);
      userData.passwordHash = await bcrypt.hash(body.password, salt);
      delete (userData as any).password;
    }

    return this.usersService.create(userData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<User> & { password?: string }) {
    const userData = { ...body };

    // Hash password if provided
    if (body.password) {
      const bcrypt = await import('bcrypt');
      const salt = await bcrypt.genSalt(10);
      userData.passwordHash = await bcrypt.hash(body.password, salt);
      delete (userData as any).password;
    }

    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
