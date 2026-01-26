import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LeaveStatus } from '../schemas/leave.schema';

export class UpdateLeaveStatusDto {
    @IsEnum(LeaveStatus)
    @IsNotEmpty()
    status: LeaveStatus;

    @IsString()
    @IsOptional()
    rejectionReason?: string;
}
