import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pierre' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+250 737 213 060' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'StrongP@ss1', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
