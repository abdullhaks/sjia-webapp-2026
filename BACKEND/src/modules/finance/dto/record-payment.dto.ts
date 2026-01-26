
import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../schemas/fee-payment.schema';

export class RecordPaymentDto {
    @IsString()
    studentId: string;

    @IsString()
    feeStructureId: string;

    @IsNumber()
    amountPaid: number;

    @IsDateString()
    paymentDate: string;

    @IsEnum(PaymentMethod)
    method: string;

    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: string;

    @IsOptional()
    @IsString()
    transactionId?: string;

    @IsOptional()
    @IsString()
    remarks?: string;
}
