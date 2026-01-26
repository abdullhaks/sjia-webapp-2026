import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateSyllabusDto {
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    class: string;

    @IsOptional()
    @IsString()
    program?: string;

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsNumber()
    @IsNotEmpty()
    fileSize: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    academicYear: string;

    @IsOptional()
    @IsString()
    term?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
