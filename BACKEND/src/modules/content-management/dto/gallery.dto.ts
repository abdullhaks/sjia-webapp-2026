import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class CreateGalleryDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    imageUrl: string;

    @IsEnum(['campus', 'events', 'achievements', 'other'])
    category: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateGalleryDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(['campus', 'events', 'achievements', 'other'])
    category?: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
