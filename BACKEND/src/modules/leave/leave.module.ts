import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { LeaveRepository } from './leave.repository';
import { Leave, LeaveSchema } from './schemas/leave.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }]),
    ],
    controllers: [LeaveController],
    providers: [LeaveService, LeaveRepository],
    exports: [LeaveService],
})
export class LeaveModule { }
