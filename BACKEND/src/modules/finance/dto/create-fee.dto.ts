
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { FeeFrequency } from '../schemas/fee-structure.schema';

export class CreateFeeDto {
    @IsString()
    title: string;

    @IsNumber()
    amount: number;

    @IsString()
    class: string;

    @IsEnum(FeeFrequency)
    frequency: string;

    @IsDateString()
    dueDate: string;

    @IsOptional()
    @IsString()
    description?: string;
}
