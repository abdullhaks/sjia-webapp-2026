import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { NotificationService } from '../../shared/notification.service';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { Staff, StaffDocument } from '../staff/schemas/staff.schema';

@Injectable()
export class NoticeService {
    constructor(
        @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
        private readonly notificationService: NotificationService,
    ) { }

    async create(createNoticeDto: CreateNoticeDto, userId: string): Promise<Notice> {
        const newNotice = new this.noticeModel({
            ...createNoticeDto,
            createdBy: userId,
        });
        const savedNotice = await newNotice.save();

        // Broadcast notification to relevant audience asynchronously
        this.broadcastNoticeNotification(savedNotice).catch(() => { /* fire and forget */ });

        return savedNotice;
    }

    /**
     * Broadcasts a DB notification to all recipients matching the notice's audience.
     */
    private async broadcastNoticeNotification(notice: any) {
        const recipientIds: string[] = [];
        const audience = notice.audience || 'all';

        if (audience === 'all' || audience === 'student') {
            const students = await this.studentModel
                .find({ isActive: true, status: 'Active' })
                .select('_id')
                .lean()
                .exec();
            recipientIds.push(...students.map((s: any) => s._id.toString()));
        }

        if (audience === 'all' || audience === 'staff') {
            const staff = await this.staffModel
                .find({ isActive: true, status: 'Active' })
                .select('_id')
                .lean()
                .exec();
            recipientIds.push(...staff.map((s: any) => s._id.toString()));
        }

        if (recipientIds.length > 0) {
            await this.notificationService.broadcastNotification(
                recipientIds,
                `📢 ${notice.title}`,
                notice.content.substring(0, 200),
                notice.priority === 'high' ? 'URGENT' : 'INFO',
                '/notices',
            );
        }
    }

    async findAll(audience?: string): Promise<Notice[]> {
        const query: any = { isActive: true };
        if (audience) {
            query.audience = { $in: ['all', audience] };
        }
        return this.noticeModel.find(query).sort({ date: -1, priority: 1 }).exec();
    }

    async findOne(id: string): Promise<Notice> {
        const notice = await this.noticeModel.findById(id).exec();
        if (!notice) {
            throw new NotFoundException(`Notice with ID ${id} not found`);
        }
        return notice;
    }

    async remove(id: string): Promise<void> {
        const result = await this.noticeModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Notice with ID ${id} not found`);
        }
    }
}
