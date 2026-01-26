import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
    @IsString()
    @IsNotEmpty()
    studentId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsEnum(['Present', 'Absent', 'Late', 'Excused'])
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    class: string;

    @IsString()
    @IsOptional()
    period?: string;
}
