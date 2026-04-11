import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    description: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsString()
    @IsOptional()
    delay?: string;

    @IsBoolean()
    @IsOptional()
    isDark?: boolean;
}
