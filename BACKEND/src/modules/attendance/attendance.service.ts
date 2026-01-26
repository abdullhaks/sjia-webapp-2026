import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(@InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>) { }

    async markAttendance(createAttendanceDto: CreateAttendanceDto, userId: string): Promise<Attendance> {
        // Check if attendance already exists for this student on this date
        // Note: Ideally date would be normalized to start of day
        const existing = await this.attendanceModel.findOne({
            studentId: createAttendanceDto.studentId,
            date: createAttendanceDto.date,
        }).exec();

        if (existing) {
            // Upsert behavior: update if exists
            existing.status = createAttendanceDto.status;
            existing.markedBy = userId;
            return existing.save();
        }

        const newAttendance = new this.attendanceModel({
            ...createAttendanceDto,
            markedBy: userId,
        });
        return newAttendance.save();
    }

    async getStudentAttendance(studentId: string, month?: number, year?: number): Promise<Attendance[]> {
        const query: any = { studentId };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); // Last day of month
            query.date = { $gte: startDate, $lte: endDate };
        }

        return this.attendanceModel.find(query).sort({ date: 1 }).exec();
    }

    async getAttendanceStats(studentId: string): Promise<{ percentage: number; present: number; total: number }> {
        // Get all attendance for the academic year (simplified to all time for now)
        const records = await this.attendanceModel.find({ studentId }).exec();
        if (records.length === 0) return { percentage: 0, present: 0, total: 0 };

        const presentCount = records.filter(r => r.status === 'Present').length;
        const percentage = (presentCount / records.length) * 100;

        return { percentage, present: presentCount, total: records.length };
    }
}
