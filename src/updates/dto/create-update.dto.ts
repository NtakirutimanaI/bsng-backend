import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUpdateDto {
  @ApiProperty({ example: 'New Residential Complex Break-ground' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Project News', enum: ['Project News', 'Plot Sales', 'Renovation', 'Company News', 'Property Rental', 'Achievement'] })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'bg-primary' })
  @IsString()
  @IsNotEmpty()
  badge: string;

  @ApiProperty({ example: 'fa-hard-hat' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: 'BSNG Construction officially broke ground...' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiPropertyOptional({ example: '/img/project-1.jpg' })
  @IsOptional()
  @IsString()
  imagePath?: string;
}
