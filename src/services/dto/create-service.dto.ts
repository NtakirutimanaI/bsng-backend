import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'House Construction' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'We construct durable residential, commercial, and industrial buildings...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'fa-hard-hat' })
  @IsString()
  @IsNotEmpty()
  iconClass: string;

  @ApiProperty({ example: 'bg-primary', enum: ['bg-primary', 'bg-light'] })
  @IsString()
  @IsNotEmpty()
  themeClass: string;
}
