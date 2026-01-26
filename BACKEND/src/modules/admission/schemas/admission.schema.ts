import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdmissionDocument = Admission & Document;

export enum AdmissionStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class Admission {
    @Prop({ unique: true, default: () => `ADM-${Date.now()}` })
    applicationId: string; // Auto-generated ID

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true, enum: ['Male', 'Female'] })
    gender: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    program: string; // Course applying for

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ type: Object, required: true })
    guardianDetails: {
        name: string;
        relation: string;
        phone: string;
        occupation?: string;
    };

    @Prop({ type: Object, required: true })
    academicHistory: {
        previousSchool: string;
        lastExamPassed: string;
        percentage: number;
        yearOfPassing: number;
    };

    @Prop({ type: [Object], default: [] })
    documents: {
        title: string;
        url: string; // URL to S3 or local path
        type: string; // e.g., 'SSLC Certificate', 'Photo'
    }[];

    @Prop({
        required: true,
        enum: AdmissionStatus,
        default: AdmissionStatus.PENDING
    })
    status: string;

    @Prop()
    notes?: string; // Internal admin notes

    createdAt?: Date;
    updatedAt?: Date;
}

export const AdmissionSchema = SchemaFactory.createForClass(Admission);

// Indexes
AdmissionSchema.index({ email: 1 });
AdmissionSchema.index({ phone: 1 });
AdmissionSchema.index({ applicationId: 'text' });
