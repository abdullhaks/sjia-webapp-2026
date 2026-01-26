import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateLeadershipDto {
    @IsString()
    name: string;

    @IsString()
    position: string;

    @IsString()
    photoUrl: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateLeadershipDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
