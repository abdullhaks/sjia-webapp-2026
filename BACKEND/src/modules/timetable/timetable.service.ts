import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { Timetable, TimetableDocument } from './entities/timetable.entity';
import { SwapRequest, SwapRequestDocument } from './entities/swap-request.entity';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name) private timetableModel: Model<TimetableDocument>,
    @InjectModel(SwapRequest.name) private swapRequestModel: Model<SwapRequestDocument>,
  ) { }

  async create(createTimetableDto: CreateTimetableDto, userId: string): Promise<Timetable> {
    const timetable = new this.timetableModel({
      ...createTimetableDto,
      createdBy: userId,
    });
    return timetable.save();
  }

  async findAll(filters?: any): Promise<Timetable[]> {
    const query = filters || {};
    return this.timetableModel
      .find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Timetable | null> {
    return this.timetableModel
      .findById(id)
      .populate('createdBy', 'firstName lastName')
      .exec();
  }

  async update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<Timetable | null> {
    return this.timetableModel
      .findByIdAndUpdate(id, updateTimetableDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.timetableModel.findByIdAndDelete(id).exec();
  }

  async getTeacherSchedule(teacherName: string): Promise<any[]> {
    const timetables = await this.timetableModel.find({
      type: 'grid',
      isActive: true,
    }).exec();

    const schedule = [];

    for (const timetable of timetables) {
      if (!timetable.gridData) continue;

      const teacherSlots = timetable.gridData.filter((slot) =>
        slot.teacher.toLowerCase().includes(teacherName.toLowerCase())
      );

      if (teacherSlots.length > 0) {
        schedule.push(...teacherSlots.map((slot) => ({
          ...slot,
          class: timetable.class,
          academicYear: timetable.academicYear,
          timetableId: timetable._id,
        })));
      }
    }

    return schedule;
  }

  async getClassSchedule(className: string): Promise<Timetable | null> {
    return this.timetableModel.findOne({
      class: className,
      isActive: true,
    }).sort({ createdAt: -1 }).exec();
  }

  // --- Period Exchange Logic ---

  async requestPeriodSwap(data: any, rootUserId: string): Promise<SwapRequest> {
    const request = new this.swapRequestModel({
      ...data,
      fromStaffId: rootUserId,
      status: 'Pending'
    });
    return request.save();
  }

  async getMySwapRequests(userId: string, role: string): Promise<any> {
    // If requested by superadmin, return all requests.
    if (role === 'admin') {
      return this.swapRequestModel.find()
        .populate('fromStaffId', 'firstName lastName photoUrl')
        .populate('toStaffId', 'firstName lastName photoUrl')
        .populate('timetableId', 'title')
        .sort({ createdAt: -1 }).exec();
    }

    // Otherwise, return pending requests for this staff
    const sent = await this.swapRequestModel.find({ fromStaffId: userId })
      .populate('toStaffId', 'firstName lastName photoUrl')
      .populate('timetableId', 'title')
      .sort({ createdAt: -1 }).exec();

    const received = await this.swapRequestModel.find({ toStaffId: userId, status: 'Pending' })
      .populate('fromStaffId', 'firstName lastName photoUrl')
      .populate('timetableId', 'title')
      .sort({ createdAt: -1 }).exec();

    return { sent, received };
  }

  async respondToSwapRequest(id: string, action: 'approve' | 'reject', userId: string, userName: string): Promise<SwapRequest> {
    const request = await this.swapRequestModel.findById(id).exec();
    if (!request) throw new NotFoundException('Swap request not found');

    if (action === 'reject') {
      request.status = 'Rejected';
      return request.save();
    }

    if (action === 'approve') {
      // Find the specific timetable and modify the gridData slot permanently for that specific day
      const timetable = await this.timetableModel.findById(request.timetableId).exec();
      if (!timetable || !timetable.gridData) throw new NotFoundException('Timetable not found for swap');

      let updated = false;
      timetable.gridData = timetable.gridData.map(slot => {
        if (slot.day === request.day && slot.period === request.period && slot.subject === request.subject) {
          slot.teacher = userName; // Target staff name accepting it
          updated = true;
        }
        return slot;
      });

      if (!updated) {
        throw new BadRequestException('Matching slot not found in timetable grid.');
      }

      await this.timetableModel.findByIdAndUpdate(request.timetableId, { gridData: timetable.gridData });

      request.status = 'Approved';
      return request.save();
    }

    throw new BadRequestException('Invalid action');
  }
}
