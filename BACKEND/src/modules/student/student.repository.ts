import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentRepository {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    ) { }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const createdStudent = new this.studentModel(createStudentDto);
        return createdStudent.save();
    }

    async findAll(query: any = {}): Promise<Student[]> {
        return this.studentModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Student> {
        const student = await this.studentModel.findById(id).exec();
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }

    async findByAdmissionNumber(admissionNumber: string): Promise<Student | null> {
        return this.studentModel.findOne({ admissionNumber }).exec();
    }

    async findByUserId(userId: string): Promise<Student | null> {
        return this.studentModel.findOne({ userId }).exec();
    }

    async findCouncilMembers(): Promise<Student[]> {
        return this.studentModel.find({ councilPosition: { $exists: true, $ne: null } }).exec();
    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const updatedStudent = await this.studentModel
            .findByIdAndUpdate(id, updateStudentDto, { new: true })
            .exec();

        if (!updatedStudent) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return updatedStudent;
    }

    async remove(id: string): Promise<Student> {
        const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
        if (!deletedStudent) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return deletedStudent;
    }
}
