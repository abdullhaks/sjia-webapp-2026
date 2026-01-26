import { IsString, IsEmail, IsNotEmpty, IsDateString, IsEnum, IsOptional, Matches, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStaffDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone: string;

    @IsString()
    @IsNotEmpty()
    designation: string;

    @IsString()
    @IsOptional()
    department?: string;

    @IsDateString()
    @IsNotEmpty()
    joiningDate: string;

    @IsString()
    @IsOptional()
    qualification?: string;

    @IsString()
    @IsOptional()
    experience?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    salary?: number;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{6}$/, { message: 'Pincode must be 6 digits' })
    pincode: string;

    @IsOptional()
    @IsEnum(['Active', 'Resigned', 'Terminated', 'Retired', 'On Leave'])
    status?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;
}
