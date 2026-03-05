import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './schemas/leave.schema';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Injectable()
export class LeaveRepository {
    constructor(
        @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
    ) { }

    async create(user: any, createLeaveDto: CreateLeaveDto): Promise<Leave> {
        const newLeave = new this.leaveModel({
            ...createLeaveDto,
            applicantId: (user as any)._id,
            firstName: user.firstName, // Assuming User has these fields, need verify or fetch
            lastName: user.lastName,
            role: user.role,
        });
        return newLeave.save();
    }

    async findAll(query: any = {}): Promise<Leave[]> {
        return this.leaveModel.find(query).sort({ createdAt: -1 }).populate('applicantId', 'email').exec();
    }

    async findByUser(userId: string): Promise<Leave[]> {
        return this.leaveModel.find({ applicantId: userId } as any).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Leave> {
        const leave = await this.leaveModel.findById(id).exec();
        if (!leave) {
            throw new NotFoundException(`Leave request with ID ${id} not found`);
        }
        return leave;
    }

    async updateStatus(id: string, updateDto: UpdateLeaveStatusDto): Promise<Leave> {
        const leave = await this.leaveModel
            .findByIdAndUpdate(
                id,
                {
                    status: updateDto.status,
                    rejectionReason: updateDto.rejectionReason
                },
                { new: true }
            )
            .populate('applicantId', 'email pushSubscription firstName')
            .exec();

        if (!leave) {
            throw new NotFoundException(`Leave request with ID ${id} not found`);
        }
        return leave;
    }
}
