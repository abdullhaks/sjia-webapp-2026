import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SiteContentDocument = SiteContent & Document;

@Schema({ timestamps: true })
export class SiteContent {
    @Prop({ required: true, unique: true })
    key: string;

    @Prop({ required: true })
    value: string;

    @Prop({
        required: true,
        enum: ['text', 'html', 'json', 'url'],
        default: 'text'
    })
    type: string;

    @Prop({ required: true })
    section: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
