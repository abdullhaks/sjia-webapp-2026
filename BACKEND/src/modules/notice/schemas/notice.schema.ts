import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true, enum: ['high', 'medium', 'low'], default: 'medium' })
    priority: string;

    @Prop({ required: true, enum: ['all', 'student', 'staff'], default: 'all' })
    audience: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
