
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeeStructureDocument = FeeStructure & Document;

export enum FeeFrequency {
    ONE_TIME = 'One Time',
    MONTHLY = 'Monthly',
    TERM = 'Term',
    YEARLY = 'Yearly',
}

@Schema({ timestamps: true })
export class FeeStructure {
    @Prop({ required: true })
    title: string; // e.g. "Tuition Fee 2025"

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    class: string; // e.g. "Class 10-A" OR "All"

    @Prop({ required: true, enum: FeeFrequency, default: FeeFrequency.TERM })
    frequency: string;

    @Prop({ required: true })
    dueDate: Date;

    @Prop()
    description?: string;
}

export const FeeStructureSchema = SchemaFactory.createForClass(FeeStructure);
