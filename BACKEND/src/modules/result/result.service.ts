import { Injectable } from '@nestjs/common';
import { ResultRepository } from './result.repository';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { NotificationService } from '../../shared/notification.service';

@Injectable()
export class ResultService {
    constructor(
        private readonly resultRepository: ResultRepository,
        private readonly notificationService: NotificationService,
    ) { }

    private async notifyIfPublished(result: any) {
        if (result.status === 'Published' && result.studentId) {
            const student = result.studentId as unknown as any;
            const examTitle = result.examId?.title || 'Exam';

            const subject = `Your results for ${examTitle} are out!`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Assalamu Alaikum ${student.firstName},</h2>
                    <p>Your results for the recent <strong>${examTitle}</strong> have been published.</p>
                    <p>You scored <strong>${result.percentage}%</strong> (${result.totalObtainedMarks}/${result.totalMaxMarks}).</p>
                    <p>Log in to your portal to view the detailed breakdown.</p>
                    <p>Jazakallah Khair,</p>
                    <p>SJIA Examinations</p>
                </div>
            `;
            const pushPayload = {
                title: 'Results Published! 📝',
                body: `Your marks for ${examTitle} are now available. Score: ${result.percentage}%`,
                url: '/student/results',
            };

            await this.notificationService.sendDualNotification({
                email: student.email,
                emailSubject: subject,
                emailHtml: html,
                pushSubscription: student.pushSubscription,
                pushPayload,
                recipientId: student._id?.toString() || student.id,
                type: 'SUCCESS',
            });
        }
    }

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

        const result = await this.resultRepository.create(resultData as any);
        await this.notifyIfPublished(result);
        return result;
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

    async searchPublicResults(query: string) {
        return this.resultRepository.searchPublicResults(query);
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

        const result = await this.resultRepository.update(id, updateResultDto);
        await this.notifyIfPublished(result);
        return result;
    }

    async remove(id: string) {
        return this.resultRepository.remove(id);
    }
}
