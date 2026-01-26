import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimetableSlot = {
    day: string;
    period: number;
    subject: string;
    teacher: string;
    room?: string;
    startTime: string;
    endTime: string;
};

export type TimetableDocument = Timetable & Document;

@Schema({ timestamps: true })
export class Timetable {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    class: string;

    @Prop()
    program: string;

    @Prop({ required: true, enum: ['pdf', 'grid'] })
    type: string;

    @Prop()
    fileUrl: string;

    @Prop()
    fileName: string;

    @Prop({ type: Array })
    gridData: TimetableSlot[];

    @Prop({ required: true })
    academicYear: string;

    @Prop()
    term: string;

    @Prop({ required: true })
    effectiveFrom: Date;

    @Prop()
    effectiveTo: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
