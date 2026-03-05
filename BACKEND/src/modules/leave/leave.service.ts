import { Injectable } from '@nestjs/common';
import { LeaveRepository } from './leave.repository';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { NotificationService } from '../../shared/notification.service';

@Injectable()
export class LeaveService {
    constructor(
        private readonly leaveRepository: LeaveRepository,
        private readonly notificationService: NotificationService,
    ) { }

    async create(user: any, createLeaveDto: CreateLeaveDto) {
        return this.leaveRepository.create(user, createLeaveDto);
    }

    async findAll() {
        return this.leaveRepository.findAll();
    }

    async findMyLeaves(userId: string) {
        return this.leaveRepository.findByUser(userId);
    }

    async updateStatus(id: string, updateDto: UpdateLeaveStatusDto) {
        const leave = await this.leaveRepository.updateStatus(id, updateDto);

        // Dispatch Notification
        const applicant = leave.applicantId as unknown as any;
        if (applicant) {
            const subject = `Leave Request ${updateDto.status}`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Assalamu Alaikum ${applicant.firstName},</h2>
                    <p>Your leave request from <strong>${leave.startDate.toDateString()}</strong> to <strong>${leave.endDate.toDateString()}</strong> has been <strong>${updateDto.status}</strong>.</p>
                    ${updateDto.rejectionReason ? `<p><strong>Reason:</strong> ${updateDto.rejectionReason}</p>` : ''}
                    <p>Jazakallah Khair,</p>
                    <p>SJIA Administration</p>
                </div>
            `;

            const pushPayload = {
                title: `Leave ${updateDto.status}`,
                body: `Your leave request for ${leave.startDate.toDateString()} is ${updateDto.status}.`,
                url: '/student/leave',
            };

            await this.notificationService.sendDualNotification({
                email: applicant.email,
                emailSubject: subject,
                emailHtml: html,
                pushSubscription: applicant.pushSubscription,
                pushPayload,
                recipientId: applicant._id?.toString() || applicant.id,
                type: 'INFO',
            });
        }

        return leave;
    }
}
