import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../../shared/enums/roles.enum';

export type StaffDocument = Staff & Document;

@Schema({ timestamps: true })
export class Staff {
    @Prop({ required: true, unique: true })
    employeeId: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    // Auth fields added since User collection is removed
    @Prop({ required: true })
    password?: string; // Optional if existing data lacks it, but we can make it required. We use optional to avoid breaks during migration.

    @Prop({ required: true, enum: UserRole, default: UserRole.STAFF })
    role: UserRole;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: null })
    refreshToken?: string;

    @Prop()
    lastLogin?: Date;

    @Prop({ type: Object, default: null })
    pushSubscription?: any;

    @Prop({ default: null })
    resetPasswordToken?: string;

    @Prop({ default: null })
    resetPasswordExpires?: Date;

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
