import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticeService {
    constructor(@InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>) { }

    async create(createNoticeDto: CreateNoticeDto, userId: string): Promise<Notice> {
        const newNotice = new this.noticeModel({
            ...createNoticeDto,
            createdBy: userId,
        });
        return newNotice.save();
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
