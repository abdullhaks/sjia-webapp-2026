import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalaryDocument = Salary & Document;

@Schema({ timestamps: true })
export class Salary {
    @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
    staffId: string;

    @Prop({ required: true })
    month: string; // e.g., '2026-02'

    @Prop({ required: true })
    baseSalary: number;

    @Prop({ default: 0 })
    deductions: number;

    @Prop({ default: 0 })
    bonuses: number;

    @Prop({ required: true })
    netSalary: number;

    @Prop({ default: 'Pending', enum: ['Pending', 'Paid'] })
    status: string;

    @Prop()
    paymentDate?: Date;

    @Prop()
    paymentMethod?: string; // Cash, Transfer, Cheque
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
