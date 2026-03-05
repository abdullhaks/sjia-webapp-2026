import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserRole } from '../../shared/enums/roles.enum';

export type SuperAdminDocument = SuperAdmin & Document;

@Schema({ timestamps: true })
export class SuperAdmin {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: UserRole })
    role: UserRole;

    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ required: true, trim: true })
    lastName: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: null })
    refreshToken: string;

    @Prop()
    lastLogin: Date;

    @Prop({ type: Object, default: null })
    pushSubscription: any;

    @Prop({ default: null })
    photoUrl: string;

    @Prop({ default: null })
    resetPasswordToken: string;

    @Prop({ default: null })
    resetPasswordExpires: Date;
}

export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);

// Create indexes
// SuperAdminSchema.index({ email: 1 });
// SuperAdminSchema.index({ role: 1 });

// Virtual for full name
SuperAdminSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
