import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { Timetable, TimetableDocument } from './entities/timetable.entity';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name) private timetableModel: Model<TimetableDocument>,
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
}
