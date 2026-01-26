
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Student } from '../../student/schemas/student.schema';
import { FeeStructure } from './fee-structure.schema';

export type FeePaymentDocument = FeePayment & Document;

export enum PaymentMethod {
    CASH = 'Cash',
    ONLINE = 'Online',
    CHECK = 'Check',
    TRANSFER = 'Transfer',
}

export enum PaymentStatus {
    PENDING = 'Pending',
    PARTIAL = 'Partial',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
}

@Schema({ timestamps: true })
export class FeePayment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
    student: Student;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'FeeStructure', required: true })
    feeStructure: FeeStructure;

    @Prop({ required: true })
    amountPaid: number;

    @Prop({ required: true })
    paymentDate: Date;

    @Prop({ required: true, enum: PaymentMethod })
    method: string;

    @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PAID })
    status: string;

    @Prop()
    transactionId?: string; // For online payments

    @Prop()
    remarks?: string;
}

export const FeePaymentSchema = SchemaFactory.createForClass(FeePayment);
