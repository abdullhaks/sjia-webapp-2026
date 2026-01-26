import { Injectable } from '@nestjs/common';
import { ResultRepository } from './result.repository';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultService {
    constructor(private readonly resultRepository: ResultRepository) { }

    async create(createResultDto: CreateResultDto) {
        // Calculate totals and percentage
        const { marks } = createResultDto;
        const totalObtained = marks.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
        const totalMax = marks.reduce((sum, subject) => sum + subject.maxMarks, 0);
        const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        const resultData = {
            ...createResultDto,
            totalObtainedMarks: totalObtained,
            totalMaxMarks: totalMax,
            percentage: parseFloat(percentage.toFixed(2)),
        };

        return this.resultRepository.create(resultData as any);
    }

    async findAll(query: any) {
        return this.resultRepository.findAll(query);
    }

    async findTopPerformers(limit: number) {
        return this.resultRepository.findTopPerformers(limit);
    }

    async findByStudent(studentId: string) {
        return this.resultRepository.findAll({ studentId, status: 'Published' });
    }

    async findOne(id: string) {
        return this.resultRepository.findOne(id);
    }

    async update(id: string, updateResultDto: UpdateResultDto) {
        // Recalculate if marks changed
        if (updateResultDto.marks) {
            const { marks } = updateResultDto;
            const totalObtained = marks.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
            const totalMax = marks.reduce((sum, subject) => sum + subject.maxMarks, 0);
            const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

            // This merges the calculated values into the update DTO
            Object.assign(updateResultDto, {
                totalObtainedMarks: totalObtained,
                totalMaxMarks: totalMax,
                percentage: parseFloat(percentage.toFixed(2)),
            });
        }

        return this.resultRepository.update(id, updateResultDto);
    }

    async remove(id: string) {
        return this.resultRepository.remove(id);
    }
}
