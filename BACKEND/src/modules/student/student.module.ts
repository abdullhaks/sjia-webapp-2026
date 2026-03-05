import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentPublicController } from './student.public.controller';
import { StudentRepository } from './student.repository';
import { Student, StudentSchema } from './schemas/student.schema';
import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
        SharedModule,
    ],
    controllers: [StudentController, StudentPublicController],
    providers: [StudentService, StudentRepository],
    exports: [StudentService],
})
export class StudentModule { }
