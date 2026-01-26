import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UserRole } from '../../database/schemas/user.schema';
import { S3Service } from '../../shared/s3.service';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
    constructor(
        private readonly studentService: StudentService,
        private readonly s3Service: S3Service,
    ) { }

    @Get('me')
    @Roles(UserRole.STUDENT)
    async getMyProfile(@Req() req: any) {
        return this.studentService.findByUserId(req.user.sub);
    }

    @Patch('me')
    @Roles(UserRole.STUDENT)
    @UseInterceptors(FileInterceptor('file'))
    async updateMyProfile(
        @Req() req: any,
        @Body() updateStudentDto: UpdateStudentDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/student');
            updateStudentDto.photoUrl = imageUrl;
        }
        return this.studentService.updateByUserId(req.user.sub, updateStudentDto);
    }

    @Post()
    @Roles(UserRole.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() createStudentDto: CreateStudentDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/student');
            createStudentDto.photoUrl = imageUrl;
        }
        return this.studentService.create(createStudentDto);
    }

    @Get()
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findAll(@Query() query: any) {
        return this.studentService.findAll(query);
    }

    @Get(':id')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findOne(@Param('id') id: string) {
        return this.studentService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/student');
            updateStudentDto.photoUrl = imageUrl;
        }
        return this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.studentService.remove(id);
    }
}
