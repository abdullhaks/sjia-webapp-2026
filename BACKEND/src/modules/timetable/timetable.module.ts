import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Timetable, TimetableSchema } from './entities/timetable.entity';
import { StaffModule } from '../staff/staff.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timetable.name, schema: TimetableSchema },
    ]),
    MulterModule.register({
      dest: './uploads/timetable',
    }),
    StaffModule,
    StudentModule,
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule { }
