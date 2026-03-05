import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salary, SalaryDocument } from './schemas/salary.schema';

@Injectable()
export class SalaryService {
    constructor(
        @InjectModel(Salary.name) private salaryModel: Model<SalaryDocument>
    ) { }

    async create(createDto: any): Promise<Salary> {
        const salary = new this.salaryModel(createDto);
        return salary.save();
    }

    async findAll(query: any = {}): Promise<Salary[]> {
        return this.salaryModel.find(query).populate('staffId', 'firstName lastName employeeId designation department').sort({ month: -1 }).exec();
    }

    async findByStaffId(staffId: string): Promise<Salary[]> {
        return this.salaryModel.find({ staffId }).sort({ month: -1 }).exec();
    }

    async update(id: string, updateDto: any): Promise<Salary> {
        const updated = await this.salaryModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Salary record not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<Salary> {
        const deleted = await this.salaryModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Salary record not found`);
        }
        return deleted;
    }
}
