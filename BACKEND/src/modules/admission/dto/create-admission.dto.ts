import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    Matches,
} from 'class-validator';

export class CreateAdmissionDto {
    @IsString()
    @IsNotEmpty()
    studentName: string;

    @IsString()
    @IsNotEmpty()
    parentName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone number must be 10-15 digits' })
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @Min(5)
    @Max(100)
    age: number;

    @IsString()
    @IsNotEmpty()
    preferredClass: string;

    @IsString()
    @IsNotEmpty()
    place: string;
}
