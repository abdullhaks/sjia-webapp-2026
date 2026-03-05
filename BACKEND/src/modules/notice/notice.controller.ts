import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';

@Controller('notice')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) { }

    @Post()
    @Roles(UserRole.SUPERADMIN, UserRole.STAFF) // Staff can also create notices? Assuming yes for now.
    create(@Body() createNoticeDto: CreateNoticeDto, @Request() req: any) {
        return this.noticeService.create(createNoticeDto, req.user.userId);
    }

    @Get()
    findAll(@Query('audience') audience?: string) {
        return this.noticeService.findAll(audience);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.noticeService.findOne(id);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.noticeService.remove(id);
    }
}
