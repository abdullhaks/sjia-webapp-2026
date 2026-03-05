import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }

    // Apply for Leave (Staff & Student)
    @Post('apply')
    @Roles(UserRole.STAFF, UserRole.STUDENT, UserRole.SUPERADMIN) // Superadmin can also apply?
    create(@Request() req: any, @Body() createLeaveDto: CreateLeaveDto) {
        return this.leaveService.create(req.user, createLeaveDto);
    }

    // Get My Leaves (All Roles)
    @Get('my-leaves')
    findMyLeaves(@Request() req: any) {
        return this.leaveService.findMyLeaves(req.user.sub);
    }

    // Admin: Get All Requests
    @Get('requests')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findAllRequests() {
        return this.leaveService.findAll();
    }

    // Admin: Approve/Reject Leave
    @Patch(':id/status')
    @Roles(UserRole.SUPERADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateLeaveStatusDto
    ) {
        return this.leaveService.updateStatus(id, updateDto);
    }
}
