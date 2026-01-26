import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
    studentId: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true, enum: ['Present', 'Absent', 'Late', 'Excused'], default: 'Present' })
    status: string;

    @Prop({ required: true })
    class: string; // e.g., 'SSLC A'

    @Prop()
    period?: string; // Optional, if taking period-wise attendance

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    markedBy: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true }); // Prevent duplicate attendance for same student on same date (simplification)
