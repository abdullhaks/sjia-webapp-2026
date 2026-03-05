import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SwapRequestDocument = SwapRequest & Document;

@Schema({ timestamps: true })
export class SwapRequest {
    @Prop({ type: Types.ObjectId, ref: 'Timetable', required: true })
    timetableId: Types.ObjectId;

    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    period: number;

    @Prop({ required: true })
    className: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    fromStaffId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    toStaffId: Types.ObjectId;

    @Prop({ required: true })
    reason: string;

    @Prop({ enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' })
    status: string;
}

export const SwapRequestSchema = SchemaFactory.createForClass(SwapRequest);
