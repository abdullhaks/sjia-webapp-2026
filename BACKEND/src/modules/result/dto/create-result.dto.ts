import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
    Min,
    Max
} from 'class-validator';

class SubjectMarkDto {
    @IsString()
    @IsNotEmpty()
    subjectName: string;

    @IsNumber()
    @Min(0)
    obtainedMarks: number;

    @IsNumber()
    @Min(1)
    maxMarks: number;

    @IsString()
    @IsOptional()
    grade?: string;
}

export class CreateResultDto {
    @IsString()
    @IsNotEmpty()
    examId: string;

    @IsString()
    @IsNotEmpty()
    studentId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubjectMarkDto)
    marks: SubjectMarkDto[];

    @IsString()
    @IsOptional()
    status?: string;
}
