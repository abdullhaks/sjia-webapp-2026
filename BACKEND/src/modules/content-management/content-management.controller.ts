import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
    UseInterceptors,
    UploadedFile,
    SetMetadata,
} from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentManagementService } from './content-management.service';
import { S3Service } from '../../shared/s3.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { CreateLeadershipDto, UpdateLeadershipDto } from './dto/leadership.dto';
import { UpdateSiteContentDto } from './dto/site-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';

@Controller('content')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContentManagementController {
    constructor(
        private readonly contentManagementService: ContentManagementService,
        private readonly s3Service: S3Service,
    ) { }

    // File Upload Endpoint
    @Post('upload')
    @Roles(UserRole.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const url = await this.s3Service.uploadFile(file, 'sjia/cms');
        return {
            url,
            filename: file.originalname, // S3 URL contains the unique name, but frontend might expect this
            originalName: file.originalname,
        };
    }

    // Gallery Endpoints
    @Post('gallery')
    @Roles(UserRole.SUPERADMIN)
    createGallery(@Body() createGalleryDto: CreateGalleryDto, @Request() req: any) {
        return this.contentManagementService.createGallery(createGalleryDto, req.user.userId);
    }

    @Get('gallery')
    @Public()
    findAllGallery(@Query() query: any) {
        return this.contentManagementService.findAllGallery(query);
    }

    @Get('gallery/:id')
    @Public()
    findOneGallery(@Param('id') id: string) {
        return this.contentManagementService.findOneGallery(id);
    }

    @Patch('gallery/:id')
    @Roles(UserRole.SUPERADMIN)
    updateGallery(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
        return this.contentManagementService.updateGallery(id, updateGalleryDto);
    }

    @Delete('gallery/:id')
    @Roles(UserRole.SUPERADMIN)
    removeGallery(@Param('id') id: string) {
        return this.contentManagementService.removeGallery(id);
    }

    // Leadership Endpoints
    @Post('leadership')
    @Roles(UserRole.SUPERADMIN)
    createLeadership(@Body() createLeadershipDto: CreateLeadershipDto) {
        return this.contentManagementService.createLeadership(createLeadershipDto);
    }

    @Get('leadership')
    @Public()
    findAllLeadership() {
        return this.contentManagementService.findAllLeadership();
    }

    @Get('leadership/:id')
    @Public()
    findOneLeadership(@Param('id') id: string) {
        return this.contentManagementService.findOneLeadership(id);
    }

    @Patch('leadership/:id')
    @Roles(UserRole.SUPERADMIN)
    updateLeadership(@Param('id') id: string, @Body() updateLeadershipDto: UpdateLeadershipDto) {
        return this.contentManagementService.updateLeadership(id, updateLeadershipDto);
    }

    @Delete('leadership/:id')
    @Roles(UserRole.SUPERADMIN)
    removeLeadership(@Param('id') id: string) {
        return this.contentManagementService.removeLeadership(id);
    }

    // Site Content Endpoints
    @Get('site-content')
    @Public()
    findAllSiteContent() {
        return this.contentManagementService.findAllSiteContent();
    }

    @Get('site-content/:key')
    @Public()
    findSiteContentByKey(@Param('key') key: string) {
        return this.contentManagementService.findSiteContentByKey(key);
    }

    @Patch('site-content/:key')
    @Roles(UserRole.SUPERADMIN)
    updateSiteContent(
        @Param('key') key: string,
        @Body() updateSiteContentDto: UpdateSiteContentDto,
        @Request() req: any,
    ) {
        return this.contentManagementService.updateSiteContent(key, updateSiteContentDto, req.user.userId);
    }
}
