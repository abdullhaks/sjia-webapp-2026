import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdmissionDocument = Admission & Document;

export enum AdmissionStatus {
    PENDING = 'Pending',
    INTERVIEW_SCHEDULED = 'InterviewScheduled',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class Admission {
    @Prop({ unique: true, default: () => `ADM-${Date.now()}` })
    applicationId: string;

    @Prop({ required: true })
    studentName: string;

    @Prop({ required: true })
    parentName: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    preferredClass: string;

    @Prop({ required: true })
    place: string;

    @Prop({
        required: true,
        enum: AdmissionStatus,
        default: AdmissionStatus.PENDING,
    })
    status: string;

    @Prop()
    interviewDate?: Date;

    @Prop()
    rejectionReason?: string;

    @Prop()
    notes?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const AdmissionSchema = SchemaFactory.createForClass(Admission);

AdmissionSchema.index({ phone: 1 });
AdmissionSchema.index({ applicationId: 'text' });
AdmissionSchema.index({ status: 1 });
