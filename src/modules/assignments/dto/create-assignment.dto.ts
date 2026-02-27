import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsString()
    @IsNotEmpty()
    siteId: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    status?: string;
}
