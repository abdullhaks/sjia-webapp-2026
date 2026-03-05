import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { AdmissionStatus } from '../schemas/admission.schema';

export class UpdateAdmissionStatusDto {
    @IsEnum(AdmissionStatus)
    @IsNotEmpty()
    status: AdmissionStatus;

    @IsDateString()
    @IsOptional()
    interviewDate?: string;

    @IsString()
    @IsOptional()
    rejectionReason?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
