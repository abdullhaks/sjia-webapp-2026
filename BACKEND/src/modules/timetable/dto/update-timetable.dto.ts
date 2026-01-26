import { IsString, IsOptional, IsArray, IsDateString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TimetableSlotDto } from './create-timetable.dto';

export class UpdateTimetableDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    class?: string;

    @IsOptional()
    @IsString()
    program?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimetableSlotDto)
    gridData?: TimetableSlotDto[];

    @IsOptional()
    @IsString()
    academicYear?: string;

    @IsOptional()
    @IsString()
    term?: string;

    @IsOptional()
    @IsDateString()
    effectiveFrom?: string;

    @IsOptional()
    @IsDateString()
    effectiveTo?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
