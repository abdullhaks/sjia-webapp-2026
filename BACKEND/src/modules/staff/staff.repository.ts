import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffRepository {
    constructor(
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    ) { }

    async create(createStaffDto: CreateStaffDto): Promise<Staff> {
        const createdStaff = new this.staffModel(createStaffDto);
        return createdStaff.save();
    }

    async findAll(query: any = {}): Promise<Staff[]> {
        return this.staffModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Staff> {
        const staff = await this.staffModel.findById(id).exec();
        if (!staff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }
        return staff;
    }

    async findByEmployeeId(employeeId: string): Promise<Staff | null> {
        return this.staffModel.findOne({ employeeId }).exec();
    }

    async findByUserId(userId: string): Promise<Staff | null> {
        return this.staffModel.findOne({ userId }).exec();
    }

    async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
        const updatedStaff = await this.staffModel
            .findByIdAndUpdate(id, updateStaffDto, { new: true })
            .exec();

        if (!updatedStaff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }
        return updatedStaff;
    }

    async remove(id: string): Promise<Staff> {
        const deletedStaff = await this.staffModel.findByIdAndDelete(id).exec();
        if (!deletedStaff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }
        return deletedStaff;
    }
}
