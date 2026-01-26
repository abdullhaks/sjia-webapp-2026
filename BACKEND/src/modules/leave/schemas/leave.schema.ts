import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../../database/schemas/user.schema';

export type LeaveDocument = Leave & Document;

export enum LeaveStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export enum LeaveType {
    SICK = 'Sick Leave',
    CASUAL = 'Casual Leave',
    EMERGENCY = 'Emergency Leave',
    OTHER = 'Other',
}

@Schema({ timestamps: true })
export class Leave {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    applicantId: User;

    @Prop({ required: true })
    firstName: string; // Snapshot of name for easy display

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    role: string; // Staff or Student

    @Prop({ required: true, enum: LeaveType })
    type: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    reason: string;

    @Prop({
        required: true,
        enum: LeaveStatus,
        default: LeaveStatus.PENDING
    })
    status: string;

    @Prop()
    rejectionReason?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);

LeaveSchema.index({ applicantId: 1 });
LeaveSchema.index({ status: 1 });
