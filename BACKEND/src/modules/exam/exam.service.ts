import { Injectable } from '@nestjs/common';
import { ExamRepository } from './exam.repository';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamStatus } from './schemas/exam.schema';

@Injectable()
export class ExamService {
    constructor(private readonly examRepository: ExamRepository) { }

    async create(createExamDto: CreateExamDto) {
        return this.examRepository.create(createExamDto);
    }

    async findAll(role?: string) {
        let query: any = {};

        if (role === 'student' || !role) {
            // Show upcoming and ongoing exams for students/public
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of today

            query = {
                // Exams that are scheduled or ongoing, and whose end date is today or in the future
                $or: [
                    { status: ExamStatus.SCHEDULED, endDate: { $gte: today } },
                    { status: ExamStatus.ONGOING }
                ]
            };
        }
        // If other roles, no specific query is applied, effectively showing all exams
        // The original code had a specific query for student/public and an empty query for others.
        // This new logic combines student/public into one condition.

        return this.examRepository.findAll(query);
    }

    async findOne(id: string) {
        return this.examRepository.findOne(id);
    }

    async update(id: string, updateExamDto: UpdateExamDto) {
        return this.examRepository.update(id, updateExamDto);
    }

    async remove(id: string) {
        return this.examRepository.remove(id);
    }
}
