import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jean Pierre' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+250 737 213 060' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'construction', enum: ['construction', 'plot', 'rental', 'renovation', 'brokerage', 'other'] })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty({ example: 'Need a quote for a 3-bedroom house' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'I am interested in building a residential house in Kibagabaga area...' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
