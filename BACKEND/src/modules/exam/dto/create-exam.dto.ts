import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsDateString,
    IsArray,
    ValidateNested,
    IsNumber,
    IsOptional
} from 'class-validator';
import { ExamType, ExamStatus } from '../schemas/exam.schema';

class SubjectScheduleDto {
    @IsString()
    @IsNotEmpty()
    subjectName: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    duration: string;

    @IsNumber()
    @IsOptional()
    maxMarks?: number;
}

export class CreateExamDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(ExamType)
    @IsNotEmpty()
    type: ExamType;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    classes: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubjectScheduleDto)
    schedule: SubjectScheduleDto[];

    @IsString()
    @IsOptional()
    description?: string;
}
