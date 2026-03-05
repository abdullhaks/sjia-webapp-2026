import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    @Roles(UserRole.STAFF, UserRole.SUPERADMIN)
    markAttendance(@Body() createAttendanceDto: CreateAttendanceDto, @Request() req: any) {
        return this.attendanceService.markAttendance(createAttendanceDto, req.user.userId);
    }

    @Post('bulk')
    @Roles(UserRole.STAFF, UserRole.SUPERADMIN)
    markBulkAttendance(@Body() records: CreateAttendanceDto[], @Request() req: any) {
        return this.attendanceService.bulkMarkAttendance(records, req.user.sub || req.user.userId);
    }

    @Get('student/:id')
    getStudentAttendance(
        @Param('id') studentId: string,
        @Query('month') month?: number,
        @Query('year') year?: number
    ) {
        return this.attendanceService.getStudentAttendance(studentId, month, year);
    }

    @Get('stats/:id')
    getAttendanceStats(@Param('id') studentId: string) {
        return this.attendanceService.getAttendanceStats(studentId);
    }
}
