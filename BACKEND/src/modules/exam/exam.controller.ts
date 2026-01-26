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
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';

@Controller('exams')
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    // Admin: Create Exam
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    create(@Body() createExamDto: CreateExamDto) {
        return this.examService.create(createExamDto);
    }

    // Admin: Get All Exams
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF) // Staff can also view all
    findAll() {
        return this.examService.findAll('admin');
    }

    // Public/Student: Get Active Exams
    @Get('public')
    findAllPublic() {
        return this.examService.findAll('student');
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findOne(@Param('id') id: string) {
        return this.examService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
        return this.examService.update(id, updateExamDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.examService.remove(id);
    }
}
