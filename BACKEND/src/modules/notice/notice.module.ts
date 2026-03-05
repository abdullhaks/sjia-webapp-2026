import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { Notice, NoticeSchema } from './schemas/notice.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { Staff, StaffSchema } from '../staff/schemas/staff.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notice.name, schema: NoticeSchema },
            { name: Student.name, schema: StudentSchema },
            { name: Staff.name, schema: StaffSchema },
        ]),
    ],
    controllers: [NoticeController],
    providers: [NoticeService],
    exports: [NoticeService],
})
export class NoticeModule { }
