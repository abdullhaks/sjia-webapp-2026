import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { LeaveType } from '../schemas/leave.schema';

export class CreateLeaveDto {
    @IsEnum(LeaveType)
    @IsNotEmpty()
    type: LeaveType;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsString()
    @IsNotEmpty()
    reason: string;
}
