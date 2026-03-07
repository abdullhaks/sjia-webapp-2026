import { Injectable } from '@nestjs/common';
import { AdmissionRepository } from './admission.repository';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionStatusDto } from './dto/update-admission-status.dto';
import { NotificationService } from '../../shared/notification.service';
import {
    applicationReceivedEmail,
    interviewScheduledEmail,
    applicationApprovedEmail,
    applicationRejectedEmail,
} from '../../shared/email-templates';

@Injectable()
export class AdmissionService {
    constructor(
        private readonly admissionRepository: AdmissionRepository,
        private readonly notificationService: NotificationService,
    ) { }

    async create(createAdmissionDto: CreateAdmissionDto) {
        const admission = await this.admissionRepository.create(createAdmissionDto);

        // Send thank-you email natively via Backend
        const emailHtml = applicationReceivedEmail(admission.studentName, admission.parentName);
        await this.notificationService.sendEmail(
            admission.email,
            'Application Received - Sheikh Jeelani Islamic Academy',
            emailHtml,
        );

        return admission;
    }

    async findAll(query: any = {}) {
        return this.admissionRepository.findAll(query);
    }

    async findOne(id: string) {
        return this.admissionRepository.findOne(id);
    }

    async updateStatus(id: string, updateDto: UpdateAdmissionStatusDto) {
        const admission = await this.admissionRepository.updateStatus(id, updateDto);

        if (admission) {
            let emailHtml = '';
            let subject = '';

            switch (updateDto.status) {
                case 'InterviewScheduled':
                    const dateStr = updateDto.interviewDate
                        ? new Date(updateDto.interviewDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : 'To be confirmed';
                    emailHtml = interviewScheduledEmail(
                        admission.studentName,
                        admission.parentName,
                        dateStr,
                        updateDto.notes,
                    );
                    subject = 'Interview Scheduled - Sheikh Jeelani Islamic Academy';
                    break;

                case 'Approved':
                    emailHtml = applicationApprovedEmail(
                        admission.studentName,
                        admission.parentName,
                        updateDto.notes,
                    );
                    subject = 'Application Approved - Sheikh Jeelani Islamic Academy';
                    break;

                case 'Rejected':
                    emailHtml = applicationRejectedEmail(
                        admission.studentName,
                        admission.parentName,
                        updateDto.rejectionReason,
                    );
                    subject = 'Application Update - Sheikh Jeelani Islamic Academy';
                    break;
            }

            if (emailHtml && subject) {
                // Send email natively via Backend
                await this.notificationService.sendEmail(admission.email, subject, emailHtml);
            }
        }

        return admission;
    }

    async remove(id: string) {
        return this.admissionRepository.remove(id);
    }
}
