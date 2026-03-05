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

import { UserRole } from '../../shared/enums/roles.enum';
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
            const oldProfile = await this.studentService.findByUserId(req.user.sub);
            if (oldProfile && oldProfile.photoUrl && oldProfile.photoUrl !== 'undefined') {
                await this.s3Service.deleteFile(oldProfile.photoUrl);
            }
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
            const oldProfile = await this.studentService.findOne(id);
            if (oldProfile && oldProfile.photoUrl && oldProfile.photoUrl !== 'undefined') {
                await this.s3Service.deleteFile(oldProfile.photoUrl);
            }
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

    // --- Folder Uploads ---
    @Post('me/folder')
    @Roles(UserRole.STUDENT)
    @UseInterceptors(FileInterceptor('file'))
    async addFolderItemMe(
        @Req() req: any,
        @Body() body: { title: string; type: 'file' | 'link'; url?: string },
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let finalUrl = body.url || '';
        if (body.type === 'file' && file) {
            finalUrl = await this.s3Service.uploadFile(file, `sjia/student/${req.user.sub}/folder`);
        }
        return this.studentService.addFolderItemUserId(req.user.sub, {
            title: body.title,
            type: body.type,
            url: finalUrl,
        });
    }

    @Delete('me/folder/:itemId')
    @Roles(UserRole.STUDENT)
    async removeFolderItemMe(@Req() req: any, @Param('itemId') itemId: string) {
        return this.studentService.removeFolderItemUserId(req.user.sub, itemId);
    }

    @Post(':id/folder')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    @UseInterceptors(FileInterceptor('file'))
    async addFolderItem(
        @Param('id') id: string,
        @Body() body: { title: string; type: 'file' | 'link'; url?: string },
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let finalUrl = body.url || '';
        if (body.type === 'file' && file) {
            finalUrl = await this.s3Service.uploadFile(file, `sjia/student/${id}/folder`);
        }
        return this.studentService.addFolderItem(id, {
            title: body.title,
            type: body.type,
            url: finalUrl,
        });
    }

    @Delete(':id/folder/:itemId')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    async removeFolderItem(@Param('id') id: string, @Param('itemId') itemId: string) {
        return this.studentService.removeFolderItem(id, itemId);
    }
}
