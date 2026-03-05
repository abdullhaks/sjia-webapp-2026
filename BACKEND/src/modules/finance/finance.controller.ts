
import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Post('fees')
    @Roles(UserRole.SUPERADMIN)
    createFee(@Body() createFeeDto: CreateFeeDto) {
        return this.financeService.createFee(createFeeDto);
    }

    @Get('fees')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    findAllFees(@Query() query: any) {
        return this.financeService.findAllFees(query);
    }

    @Post('payments')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
    recordPayment(@Body() recordPaymentDto: RecordPaymentDto) {
        return this.financeService.recordPayment(recordPaymentDto);
    }

    @Get('payments/student/:studentId')
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF, UserRole.STUDENT)
    findStudentPayments(@Param('studentId') studentId: string) {
        return this.financeService.findStudentPayments(studentId);
    }

    @Get('stats')
    @Roles(UserRole.SUPERADMIN)
    getStats() {
        return this.financeService.getStats();
    }
}
