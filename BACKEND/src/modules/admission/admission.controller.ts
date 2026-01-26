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
import { AdmissionService } from './admission.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionStatusDto } from './dto/update-admission-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';

@Controller('admission')
export class AdmissionController {
    constructor(private readonly admissionService: AdmissionService) { }

    // Public Endpoint: Submit Application
    @Post('apply')
    create(@Body() createAdmissionDto: CreateAdmissionDto) {
        return this.admissionService.create(createAdmissionDto);
    }

    // Admin: Get All Applications
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    findAll(@Query() query: any) {
        return this.admissionService.findAll(query);
    }

    // Admin: Get Single Application
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    findOne(@Param('id') id: string) {
        return this.admissionService.findOne(id);
    }

    // Admin: Update Status
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateAdmissionStatusDto
    ) {
        return this.admissionService.updateStatus(id, updateDto);
    }

    // Admin: Delete Application
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.admissionService.remove(id);
    }
}
