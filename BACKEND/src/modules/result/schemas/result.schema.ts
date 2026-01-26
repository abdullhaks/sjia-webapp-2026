import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ResultDocument = Result & Document;

class SubjectMark {
    @Prop({ required: true })
    subjectName: string;

    @Prop({ required: true })
    obtainedMarks: number;

    @Prop({ required: true })
    maxMarks: number;

    @Prop()
    grade?: string; // e.g., A+, B
}

@Schema({ timestamps: true })
export class Result {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
    examId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    studentId: string;

    @Prop({ type: [SubjectMark], required: true })
    marks: SubjectMark[];

    @Prop()
    totalObtainedMarks: number;

    @Prop()
    totalMaxMarks: number;

    @Prop()
    percentage: number;

    @Prop({ default: 'Draft' }) // Draft, Published
    status: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
