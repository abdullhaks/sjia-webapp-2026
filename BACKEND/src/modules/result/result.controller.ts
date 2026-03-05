import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('results')
export class ResultController {
    constructor(private readonly resultService: ResultService) { }

    // Staff/Admin: Enter Marks
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    create(@Body() createResultDto: CreateResultDto) {
        return this.resultService.create(createResultDto);
    }

    // Admin/Staff: View All
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findAll() {
        return this.resultService.findAll({});
    }

    // Student: View Own Results
    @Get('my-results')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    findMyResults(@Req() req: any) {
        return this.resultService.findByStudent(req.user.userId);
    }

    // Public/Student (with specific ID check if needed, simplified for now)
    @Get('student/:studentId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findByStudent(@Param('studentId') studentId: string) {
        return this.resultService.findByStudent(studentId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findOne(@Param('id') id: string) {
        return this.resultService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
        return this.resultService.update(id, updateResultDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.resultService.remove(id);
    }
}
