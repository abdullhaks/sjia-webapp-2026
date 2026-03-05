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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/roles.enum';
import { S3Service } from '../../shared/s3.service';

@Controller('syllabus')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyllabusController {
  constructor(
    private readonly syllabusService: SyllabusService,
    private readonly s3Service: S3Service,
  ) { }

  @Post('upload')
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }
    const url = await this.s3Service.uploadFile(file, 'syllabus');
    return {
      url,
      filename: file.originalname,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  create(@Body() createSyllabusDto: CreateSyllabusDto, @Request() req: any) {
    return this.syllabusService.create(createSyllabusDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF, UserRole.STUDENT)
  findAll(@Query() query: any) {
    return this.syllabusService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF, UserRole.STUDENT)
  findOne(@Param('id') id: string) {
    return this.syllabusService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() updateSyllabusDto: UpdateSyllabusDto) {
    return this.syllabusService.update(id, updateSyllabusDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.syllabusService.remove(id);
  }
}
