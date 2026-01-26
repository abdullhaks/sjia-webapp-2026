import { Type } from 'class-transformer';
import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsDateString,
    IsEnum,
    IsNumber,
    ValidateNested,
    IsOptional,
    IsArray,
    Matches
} from 'class-validator';

class GuardianDetailsDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    relation: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone: string;

    @IsString()
    @IsOptional()
    occupation?: string;
}

class AcademicHistoryDto {
    @IsString()
    @IsNotEmpty()
    previousSchool: string;

    @IsString()
    @IsNotEmpty()
    lastExamPassed: string;

    @IsNumber()
    @IsNotEmpty()
    percentage: number;

    @IsNumber()
    @IsNotEmpty()
    yearOfPassing: number;
}

class DocumentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    type: string;
}

export class CreateAdmissionDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: string;

    @IsEnum(['Male', 'Female'])
    @IsNotEmpty()
    gender: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone: string;

    @IsString()
    @IsNotEmpty()
    program: string;

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
    pincode: string;

    @ValidateNested()
    @Type(() => GuardianDetailsDto)
    @IsNotEmpty()
    guardianDetails: GuardianDetailsDto;

    @ValidateNested()
    @Type(() => AcademicHistoryDto)
    @IsNotEmpty()
    academicHistory: AcademicHistoryDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DocumentDto)
    documents?: DocumentDto[];
}
