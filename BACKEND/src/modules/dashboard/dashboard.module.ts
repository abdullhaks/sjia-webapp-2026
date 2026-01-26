import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { Staff, StaffSchema } from '../staff/schemas/staff.schema';
import { Leave, LeaveSchema } from '../leave/schemas/leave.schema';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { Admission, AdmissionSchema } from '../admission/schemas/admission.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Student.name, schema: StudentSchema },
            { name: Staff.name, schema: StaffSchema },
            { name: Leave.name, schema: LeaveSchema },
            { name: Attendance.name, schema: AttendanceSchema },
            { name: Admission.name, schema: AdmissionSchema },
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
