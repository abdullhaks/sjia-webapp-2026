import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TimetableService } from './timetable.service';
import { StaffService } from '../staff/staff.service';
import { StudentService } from '../student/student.service';
import { S3Service } from '../../shared/s3.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(
    private readonly timetableService: TimetableService,
    private readonly staffService: StaffService,
    private readonly studentService: StudentService,
    private readonly s3Service: S3Service,
  ) { }

  @Get('student/my-timetable')
  @Roles(UserRole.STUDENT)
  async getMyTimetable(@Req() req: any) {
    const student = await this.studentService.findByUserId(req.user.sub);
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }
    // Assuming student.class holds the class name like "Class 10-A"
    // We might need to handle if class is an object or ID, but usually strictly string in this schema
    return this.timetableService.getClassSchedule(student.currentClass); // e.g. "10-A"
  }

  @Get('teacher/my-schedule')
  @Roles(UserRole.STAFF)
  async getMySchedule(@Req() req: any) {
    const staff = await this.staffService.findByUserId(req.user.sub);
    if (!staff) {
      throw new NotFoundException('Staff profile not found');
    }
    const teacherName = `${staff.firstName} ${staff.lastName}`;
    return this.timetableService.getTeacherSchedule(teacherName);
  }

  @Post('upload')
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.s3Service.uploadFile(file, 'sjia/timetable');
    return {
      url,
      filename: file.originalname,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  create(@Body() createTimetableDto: CreateTimetableDto, @Request() req: any) {
    return this.timetableService.create(createTimetableDto, req.user.userId);
  }

  @Post('period-exchange')
  @Roles(UserRole.STAFF, UserRole.SUPERADMIN)
  async requestSwap(@Body() data: any, @Req() req: any) {
    if (!req.user || !req.user.sub) throw new NotFoundException('User info missing');
    return this.timetableService.requestPeriodSwap(data, req.user.sub);
  }

  @Get('period-exchange/my-requests')
  @Roles(UserRole.STAFF, UserRole.SUPERADMIN)
  async getMySwapRequests(@Req() req: any) {
    const role = req.user.role || 'staff';
    return this.timetableService.getMySwapRequests(req.user.sub, role);
  }

  @Patch('period-exchange/:id/respond')
  @Roles(UserRole.STAFF)
  async respondToSwapRequest(
    @Param('id') id: string,
    @Body('action') action: 'approve' | 'reject',
    @Req() req: any
  ) {
    const staff = await this.staffService.findByUserId(req.user.sub);
    if (!staff) throw new NotFoundException('Staff profile not found');
    const teacherName = `${staff.firstName} ${staff.lastName}`;
    return this.timetableService.respondToSwapRequest(id, action, req.user.sub, teacherName);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.timetableService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
    return this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
