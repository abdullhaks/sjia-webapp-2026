import { IsString, IsNotEmpty, IsDateString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateNoticeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsEnum(['high', 'medium', 'low'])
    @IsOptional()
    priority?: string;

    @IsEnum(['all', 'student', 'staff'])
    @IsOptional()
    audience?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
