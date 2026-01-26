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
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';
import { S3Service } from '../../shared/s3.service';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
    constructor(
        private readonly staffService: StaffService,
        private readonly s3Service: S3Service,
    ) { }

    @Get('me')
    @Roles(UserRole.STAFF)
    async getMyProfile(@Req() req: any) {
        return this.staffService.findByUserId(req.user.sub);
    }

    @Patch('me')
    @Roles(UserRole.STAFF)
    @UseInterceptors(FileInterceptor('file'))
    async updateMyProfile(
        @Req() req: any,
        @Body() updateStaffDto: UpdateStaffDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/staff');
            updateStaffDto.photoUrl = imageUrl;
        }
        return this.staffService.updateByUserId(req.user.sub, updateStaffDto);
    }

    @Post()
    @Roles(UserRole.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() createStaffDto: CreateStaffDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/staff');
            createStaffDto.photoUrl = imageUrl;
        }
        return this.staffService.create(createStaffDto);
    }

    @Get()
    @Roles(UserRole.SUPERADMIN)
    findAll(@Query() query: any) {
        return this.staffService.findAll(query);
    }

    @Get(':id')
    @Roles(UserRole.SUPERADMIN)
    findOne(@Param('id') id: string) {
        return this.staffService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @Param('id') id: string,
        @Body() updateStaffDto: UpdateStaffDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        if (file) {
            const imageUrl = await this.s3Service.uploadFile(file, 'sjia/staff');
            updateStaffDto.photoUrl = imageUrl;
        }
        return this.staffService.update(id, updateStaffDto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.staffService.remove(id);
    }
}
