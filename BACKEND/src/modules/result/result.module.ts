import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { ResultPublicController } from './result.public.controller';
import { ResultRepository } from './result.repository';
import { Result, ResultSchema } from './schemas/result.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Result.name, schema: ResultSchema },
            { name: Student.name, schema: StudentSchema }
        ]),
        SharedModule
    ],
    controllers: [ResultController, ResultPublicController],
    providers: [ResultService, ResultRepository],
    exports: [ResultService],
})
export class ResultModule { }
