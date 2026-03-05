import { IsString, IsEmail, IsNotEmpty, IsDateString, IsEnum, IsOptional, Matches } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    admissionNumber: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfAdmission: string;

    @IsEnum(['Male', 'Female'])
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsOptional()
    bloodGroup?: string;

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

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    guardianName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Guardian phone number must be 10 digits' })
    guardianPhone: string;

    @IsString()
    @IsOptional()
    guardianRelation?: string;

    @IsString()
    @IsNotEmpty()
    program: string;

    @IsString()
    @IsNotEmpty()
    batch: string;

    @IsString()
    @IsNotEmpty()
    currentClass: string;

    @IsOptional()
    @IsEnum(['Active', 'Graduated', 'Suspended', 'Left'])
    status?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    councilPosition?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    passwordMode?: string;

    @IsOptional()
    sendEmail?: any; // FormData handles checked differently
}
