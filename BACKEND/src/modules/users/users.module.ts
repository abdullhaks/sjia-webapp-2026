import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SuperAdmin, SuperAdminSchema } from '../../database/schemas/superadmin.schema';
import { Staff, StaffSchema } from '../staff/schemas/staff.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SuperAdmin.name, schema: SuperAdminSchema },
            { name: Staff.name, schema: StaffSchema },
            { name: Student.name, schema: StudentSchema }
        ]),
        SharedModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
