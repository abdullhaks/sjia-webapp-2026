import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './schemas/result.schema';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultRepository {
    constructor(
        @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    ) { }

    async create(createResultDto: CreateResultDto): Promise<Result> {
        const newResult = new this.resultModel(createResultDto);
        const saved = await newResult.save();
        return this.resultModel.findById(saved._id).populate('studentId', 'firstName lastName email pushSubscription').populate('examId', 'title').exec() as unknown as Result;
    }

    async findAll(query: any = {}): Promise<Result[]> {
        return this.resultModel
            .find(query)
            .populate('examId', 'title')
            .populate('studentId', 'name')
            .exec();
    }

    async findTopPerformers(limit: number = 5): Promise<Result[]> {
        return this.resultModel
            .find({ status: 'Published' })
            .sort({ percentage: -1 })
            .limit(limit)
            .populate('studentId', 'firstName lastName photoUrl currentClass')
            .populate('examId', 'title')
            .exec();
    }

    async searchPublicResults(query: string): Promise<Result[]> {
        const users = await this.studentModel.find({
            $or: [
                { email: { $regex: new RegExp(query, 'i') } },
                { phone: { $regex: new RegExp(query, 'i') } },
                { firstName: { $regex: new RegExp(query, 'i') } },
                { admissionNumber: { $regex: new RegExp(query, 'i') } }
            ]
        }).exec();

        const userIds = users.map(u => u._id.toString());

        return this.resultModel
            .find({ studentId: { $in: userIds } as any, status: 'Published' })
            .populate('examId', 'title startDate status endDate')
            .populate('studentId', 'firstName lastName photoUrl currentClass studentId')
            .exec();
    }

    async findOne(id: string): Promise<Result> {
        const result = await this.resultModel
            .findById(id)
            .populate('examId', 'title')
            .populate('studentId', 'firstName lastName email pushSubscription')
            .exec();

        if (!result) {
            throw new NotFoundException(`Result with ID ${id} not found`);
        }
        return result;
    }

    async update(id: string, updateResultDto: UpdateResultDto): Promise<Result> {
        const updatedResult = await this.resultModel
            .findByIdAndUpdate(id, updateResultDto, { new: true })
            .populate('studentId', 'firstName lastName email pushSubscription')
            .populate('examId', 'title')
            .exec();

        if (!updatedResult) {
            throw new NotFoundException(`Result with ID ${id} not found`);
        }
        return updatedResult;
    }

    async remove(id: string): Promise<Result> {
        const deletedResult = await this.resultModel.findByIdAndDelete(id).exec();
        if (!deletedResult) {
            throw new NotFoundException(`Result with ID ${id} not found`);
        }
        return deletedResult;
    }
}
