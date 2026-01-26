import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExamDocument = Exam & Document;

export enum ExamType {
    INTERNAL = 'Internal',
    SEMESTER = 'Semester',
    EXTERNAL = 'External',
}

export enum ExamStatus {
    SCHEDULED = 'Scheduled',
    ONGOING = 'Ongoing',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

class SubjectSchedule {
    @Prop({ required: true })
    subjectName: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    startTime: string; // e.g., "10:00 AM"

    @Prop({ required: true })
    duration: string; // e.g., "2 Hours"

    @Prop()
    maxMarks: number;
}

@Schema({ timestamps: true })
export class Exam {
    @Prop({ required: true })
    title: string; // e.g., "Mid-Term Exam 2024"

    @Prop({ required: true, enum: ExamType })
    type: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date; // Overall exam period

    @Prop({ required: true, enum: ExamStatus, default: ExamStatus.SCHEDULED })
    status: string;

    @Prop({ required: true })
    classes: string[]; // Classes involved, e.g., ["Class 10-A", "Class 10-B"] or ["SSLC"]

    @Prop({ type: [SubjectSchedule], default: [] })
    schedule: SubjectSchedule[];

    @Prop()
    description?: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
