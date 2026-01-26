import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({
        required: true,
        enum: ['campus', 'events', 'achievements', 'other'],
        default: 'other'
    })
    category: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    uploadedBy: Types.ObjectId;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
