import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { Salary, SalarySchema } from './schemas/salary.schema';
// Removed AuthModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    ],
    controllers: [SalaryController],
    providers: [SalaryService],
    exports: [SalaryService],
})
export class SalaryModule { }
