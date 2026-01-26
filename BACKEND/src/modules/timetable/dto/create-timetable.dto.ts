import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TimetableSlotDto {
    @IsString()
    @IsNotEmpty()
    day: string;

    @IsNotEmpty()
    period: number;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    teacher: string;

    @IsOptional()
    @IsString()
    room?: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;
}

export class CreateTimetableDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    class: string;

    @IsOptional()
    @IsString()
    program?: string;

    @IsEnum(['pdf', 'grid'])
    @IsNotEmpty()
    type: string;

    @IsOptional()
    @IsString()
    fileUrl?: string;

    @IsOptional()
    @IsString()
    fileName?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimetableSlotDto)
    gridData?: TimetableSlotDto[];

    @IsString()
    @IsNotEmpty()
    academicYear: string;

    @IsOptional()
    @IsString()
    term?: string;

    @IsDateString()
    @IsNotEmpty()
    effectiveFrom: string;

    @IsOptional()
    @IsDateString()
    effectiveTo?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
