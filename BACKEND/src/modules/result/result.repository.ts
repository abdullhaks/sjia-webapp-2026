import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './schemas/result.schema';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultRepository {
    constructor(
        @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    ) { }

    async create(createResultDto: CreateResultDto): Promise<Result> {
        const newResult = new this.resultModel(createResultDto);
        return newResult.save();
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

    async findOne(id: string): Promise<Result> {
        const result = await this.resultModel
            .findById(id)
            .populate('examId', 'title')
            .populate('studentId', 'name')
            .exec();

        if (!result) {
            throw new NotFoundException(`Result with ID ${id} not found`);
        }
        return result;
    }

    async update(id: string, updateResultDto: UpdateResultDto): Promise<Result> {
        const updatedResult = await this.resultModel
            .findByIdAndUpdate(id, updateResultDto, { new: true })
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
