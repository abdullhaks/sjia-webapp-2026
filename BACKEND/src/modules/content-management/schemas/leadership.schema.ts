import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadershipDocument = Leadership & Document;

@Schema({ timestamps: true })
export class Leadership {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    position: string;

    @Prop({ required: true })
    photoUrl: string;

    @Prop()
    bio: string;

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const LeadershipSchema = SchemaFactory.createForClass(Leadership);
