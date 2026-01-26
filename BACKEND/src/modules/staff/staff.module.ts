import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffRepository } from './staff.repository';
import { Staff, StaffSchema } from './schemas/staff.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
        UsersModule,
    ],
    controllers: [StaffController],
    providers: [StaffService, StaffRepository],
    exports: [StaffService],
})
export class StaffModule { }
