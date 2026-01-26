import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument, ExamStatus } from './schemas/exam.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamRepository {
    constructor(
        @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    ) { }

    async create(createExamDto: CreateExamDto): Promise<Exam> {
        const newExam = new this.examModel(createExamDto);
        return newExam.save();
    }

    async findAll(query: any = {}): Promise<Exam[]> {
        return this.examModel.find(query).sort({ startDate: 1 }).exec();
    }

    async findOne(id: string): Promise<Exam> {
        const exam = await this.examModel.findById(id).exec();
        if (!exam) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }
        return exam;
    }

    async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
        const updatedExam = await this.examModel
            .findByIdAndUpdate(id, updateExamDto, { new: true })
            .exec();

        if (!updatedExam) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }
        return updatedExam;
    }

    async remove(id: string): Promise<Exam> {
        const deletedExam = await this.examModel.findByIdAndDelete(id).exec();
        if (!deletedExam) {
            throw new NotFoundException(`Exam with ID ${id} not found`);
        }
        return deletedExam;
    }
}
