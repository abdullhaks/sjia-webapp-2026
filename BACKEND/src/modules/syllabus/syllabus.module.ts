import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { Syllabus, SyllabusSchema } from './entities/syllabus.entity';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Syllabus.name, schema: SyllabusSchema },
    ]),
    SharedModule,
  ],
  controllers: [SyllabusController],
  providers: [SyllabusService],
  exports: [SyllabusService],
})
export class SyllabusModule { }
