import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SyllabusDocument = Syllabus & Document;

@Schema({ timestamps: true })
export class Syllabus {
    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    class: string;

    @Prop()
    program: string;

    @Prop({ required: true })
    fileUrl: string;

    @Prop({ required: true })
    fileName: string;

    @Prop({ required: true })
    fileSize: number;

    @Prop()
    description: string;

    @Prop({ required: true })
    academicYear: string;

    @Prop()
    term: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    uploadedBy: Types.ObjectId;

    @Prop({ default: Date.now })
    uploadDate: Date;

    @Prop({ default: true })
    isActive: boolean;
}

export const SyllabusSchema = SchemaFactory.createForClass(Syllabus);
