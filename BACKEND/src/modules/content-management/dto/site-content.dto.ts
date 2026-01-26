import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateSiteContentDto {
    @IsString()
    value: string;

    @IsOptional()
    @IsEnum(['text', 'html', 'json', 'url'])
    type?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
