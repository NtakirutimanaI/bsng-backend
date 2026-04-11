import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Kigali Heights Commercial Complex' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A multi-story commercial building...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Rwandan Government' })
  @IsOptional()
  @IsString()
  client?: string;

  @ApiPropertyOptional({ example: 'Kigali, Rwanda' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Completed' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '2025-12-01' })
  @IsOptional()
  @IsString()
  completionDate?: string;

  @ApiPropertyOptional({ example: '/images/projects/kigali-heights.jpg' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiPropertyOptional({ example: 'uuid-of-site' })
  @IsOptional()
  @IsString()
  siteId?: string;
}
