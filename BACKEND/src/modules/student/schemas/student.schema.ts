import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
    @Prop({ required: true, unique: true })
    admissionNumber: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    // Optional: Link to User account if they have login access
    @Prop()
    userId?: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true })
    dateOfAdmission: Date;

    @Prop({ required: true, enum: ['Male', 'Female'] })
    gender: string;

    @Prop()
    bloodGroup?: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    guardianName: string;

    @Prop({ required: true })
    guardianPhone: string;

    @Prop()
    guardianRelation?: string;

    @Prop({ required: true })
    program: string; // e.g., 'SSLC', 'Plus Two', 'Degree'

    @Prop({ required: true })
    batch: string; // e.g., '2024-2025'

    @Prop({ required: true })
    currentClass: string; // e.g., '10-A'

    @Prop({ default: 'Active', enum: ['Active', 'Graduated', 'Suspended', 'Left'] })
    status: string;

    @Prop()
    photoUrl?: string;

    @Prop({ type: [Object] })
    documents?: { title: string; url: string }[];

    @Prop()
    councilPosition?: string; // e.g., 'Chairman', 'Vice Chairman', 'General Secretary', 'Arts Club Secretary'
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// Indexes
StudentSchema.index({ firstName: 'text', lastName: 'text', admissionNumber: 'text' });
