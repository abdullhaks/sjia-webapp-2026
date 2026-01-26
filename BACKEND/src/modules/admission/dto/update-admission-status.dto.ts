import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdmissionStatus } from '../schemas/admission.schema';

export class UpdateAdmissionStatusDto {
    @IsEnum(AdmissionStatus)
    @IsNotEmpty()
    status: AdmissionStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}
