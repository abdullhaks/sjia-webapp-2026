import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSyllabusDto {
    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    class?: string;

    @IsOptional()
    @IsString()
    program?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    academicYear?: string;

    @IsOptional()
    @IsString()
    term?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
