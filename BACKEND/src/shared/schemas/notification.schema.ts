import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, required: true })
    recipient: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    message: string;

    @Prop({ default: 'INFO' })
    type: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ type: String })
    url?: string;

    createdAt: Date;
    updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
