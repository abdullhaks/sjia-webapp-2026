import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperAdmin, SuperAdminDocument } from '../../database/schemas/superadmin.schema';
import { Staff, StaffDocument } from '../staff/schemas/staff.schema';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { S3Service } from '../../shared/s3.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(SuperAdmin.name) private superAdminModel: Model<SuperAdminDocument>,
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        private s3Service: S3Service,
    ) { }

    private async findUserModel(id: string) {
        let user: any = await this.superAdminModel.findById(id);
        if (user) return { user, model: this.superAdminModel as any };

        user = await this.staffModel.findById(id);
        if (user) return { user, model: this.staffModel as any };

        user = await this.studentModel.findById(id);
        if (user) return { user, model: this.studentModel as any };

        return null;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
        const updates: any = { ...updateProfileDto };

        // Hash password if provided
        if (updates.password) {
            const salt = await bcrypt.genSalt();
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const found = await this.findUserModel(userId);
        if (!found) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (file) {
            if (found.user.photoUrl) {
                await this.s3Service.deleteFile(found.user.photoUrl);
            }
            updates.photoUrl = await this.s3Service.uploadFile(file, 'profiles');
        }

        const updatedUser = await found.model
            .findByIdAndUpdate(userId, updates, { new: true })
            .select('-password')
            .exec();

        return updatedUser;
    }

    async savePushSubscription(userId: string, subscription: any) {
        const found = await this.findUserModel(userId);
        if (!found) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return found.model.findByIdAndUpdate(
            userId,
            { pushSubscription: subscription },
            { new: true }
        ).select('-password').exec();
    }
}
