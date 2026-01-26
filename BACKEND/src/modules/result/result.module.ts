import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { ResultPublicController } from './result.public.controller';
import { ResultRepository } from './result.repository';
import { Result, ResultSchema } from './schemas/result.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    ],
    controllers: [ResultController, ResultPublicController],
    providers: [ResultService, ResultRepository],
    exports: [ResultService],
})
export class ResultModule { }
