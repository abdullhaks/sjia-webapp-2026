import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSettingDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsNotEmpty()
    value: any;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    description?: string;
}
