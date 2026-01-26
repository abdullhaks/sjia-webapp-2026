import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StaffDocument = Staff & Document;

@Schema({ timestamps: true })
export class Staff {
    @Prop({ required: true, unique: true })
    employeeId: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    // Link to User account for login
    @Prop({ unique: true, sparse: true })
    userId?: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    designation: string; // Principal, Teacher, Clerk, Peon, etc.

    @Prop()
    department?: string; // Science, Maths, Humanities, Administration

    @Prop({ required: true })
    joiningDate: Date;

    @Prop()
    qualification?: string;

    @Prop()
    experience?: string;

    @Prop()
    salary?: number;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    pincode: string;

    @Prop({ default: 'Active', enum: ['Active', 'Resigned', 'Terminated', 'Retired', 'On Leave'] })
    status: string;

    @Prop()
    photoUrl?: string;

    @Prop({ type: [Object] })
    documents?: { title: string; url: string }[];
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

// Indexes
StaffSchema.index({ firstName: 'text', lastName: 'text', employeeId: 'text' });
