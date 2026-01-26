import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const updates: any = { ...updateProfileDto };

        // Hash password if provided
        if (updates.password) {
            const salt = await bcrypt.genSalt();
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, updates, { new: true })
            .select('-password')
            .exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return updatedUser;
    }
    async createUser(createUserDto: any): Promise<User> {
        // Hash password
        if (createUserDto.password) {
            const salt = await bcrypt.genSalt();
            createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
        }

        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }
}
