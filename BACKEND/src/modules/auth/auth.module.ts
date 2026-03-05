import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SuperAdmin, SuperAdminSchema } from '../../database/schemas/superadmin.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { Staff, StaffSchema } from '../staff/schemas/staff.schema';
import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [
        PassportModule,
        MongooseModule.forFeature([
            { name: SuperAdmin.name, schema: SuperAdminSchema },
            { name: Student.name, schema: StudentSchema },
            { name: Staff.name, schema: StaffSchema }
        ]),
        SharedModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwt.secret'),
                signOptions: {
                    expiresIn: configService.get('jwt.accessTokenExpiry'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
