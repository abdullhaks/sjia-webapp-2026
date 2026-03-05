import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('salary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
    constructor(private readonly salaryService: SalaryService) { }

    @Post()
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    create(@Body() createDto: any) {
        return this.salaryService.create(createDto);
    }

    @Get()
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findAll(@Query() query: any) {
        return this.salaryService.findAll(query);
    }

    @Get('staff/:staffId')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findByStaffId(@Param('staffId') staffId: string) {
        return this.salaryService.findByStaffId(staffId);
    }

    @Put(':id')
    @Roles(UserRole.SUPERADMIN)
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.salaryService.update(id, updateDto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.salaryService.remove(id);
    }
}
