import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { StaffModule } from './modules/staff/staff.module';
import { AdmissionModule } from './modules/admission/admission.module';
import { LeaveModule } from './modules/leave/leave.module';
import { ExamModule } from './modules/exam/exam.module';
import { ResultModule } from './modules/result/result.module';
import { UsersModule } from './modules/users/users.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ContentManagementModule } from './modules/content-management/content-management.module';
import { SyllabusModule } from './modules/syllabus/syllabus.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { NoticeModule } from './modules/notice/notice.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FinanceModule } from './modules/finance/finance.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    HealthModule,
    AuthModule,
    StudentModule,
    StaffModule,
    AdmissionModule,
    LeaveModule,
    ExamModule,
    ResultModule,
    UsersModule,
    SettingsModule,
    ContentManagementModule,
    SyllabusModule,
    TimetableModule,
    NoticeModule,
    AttendanceModule,
    AttendanceModule,
    DashboardModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
