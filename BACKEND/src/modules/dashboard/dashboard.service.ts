import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { Staff, StaffDocument } from '../staff/schemas/staff.schema';
import { Leave, LeaveDocument } from '../leave/schemas/leave.schema';
import { Admission, AdmissionDocument } from '../admission/schemas/admission.schema';
import { Attendance, AttendanceDocument } from '../attendance/schemas/attendance.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
        @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
        @InjectModel(Admission.name) private admissionModel: Model<AdmissionDocument>,
        @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    ) { }

    async getStats() {
        const [
            totalStudents,
            totalStaff,
            newAdmissions,
            recentActivities,
            admissionTrend,
            weeklyAttendance
        ] = await Promise.all([
            this.studentModel.countDocuments(),
            this.staffModel.countDocuments(),
            this.studentModel.countDocuments({
                createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
            }),
            this.getRecentActivities(),
            this.getAdmissionTrends(),
            this.getWeeklyAttendance()
        ]);

        const avgAttendance = 94; // Still mocked as global attendance calc is complex

        return {
            stats: [
                {
                    title: 'Total Students',
                    value: totalStudents,
                    trend: { value: 12, isPositive: true }
                },
                {
                    title: 'Total Staff',
                    value: totalStaff,
                    trend: { value: 4, isPositive: true }
                },
                {
                    title: 'New Admissions',
                    value: newAdmissions,
                    trend: { value: 8, isPositive: true }
                },
                {
                    title: 'Avg. Attendance',
                    value: avgAttendance,
                    suffix: '%',
                    trend: { value: 2, isPositive: false }
                },
            ],
            admissionTrend,
            weeklyAttendance,
            recentActivities
        };
    }

    private async getRecentActivities() {
        // Fetch recent admissions
        const recentAdmissions = await this.admissionModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName createdAt applicationId');

        // Fetch recent leaves
        const recentLeaves = await this.leaveModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName createdAt type');

        // Combine and sort
        const activities = [
            ...recentAdmissions.map(a => ({
                id: a._id,
                user: `${a.firstName} ${a.lastName}`,
                action: 'applied for admission',
                time: a.createdAt,
                type: 'admission'
            })),
            ...recentLeaves.map(l => ({
                id: l._id,
                user: `${l.firstName} ${l.lastName}`,
                action: `requested ${l.type}`,
                time: l.createdAt,
                type: 'leave'
            }))
        ].sort((a, b) => new Date(b.time as any).getTime() - new Date(a.time as any).getTime()).slice(0, 5);

        return activities;
    }

    private async getAdmissionTrends() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const aggregation = await this.studentModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Map to month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Fill gaps if needed, but for now just returning what we have
        return aggregation.map(item => ({
            name: monthNames[item._id.month - 1],
            students: item.count
        }));
    }

    private async getWeeklyAttendance() {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const aggregation = await this.attendanceModel.aggregate([
            {
                $match: {
                    date: { $gte: lastWeek },
                    status: 'Present'
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" }, // 1 (Sun) - 7 (Sat)
                    count: { $sum: 1 }
                }
            }
        ]);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return aggregation.map(item => ({
            name: days[item._id - 1],
            present: item.count
        }));
    }
}
