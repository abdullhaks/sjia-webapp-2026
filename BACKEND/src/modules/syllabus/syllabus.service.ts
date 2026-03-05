import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus, SyllabusDocument } from './entities/syllabus.entity';
import { S3Service } from '../../shared/s3.service';

@Injectable()
export class SyllabusService {
  constructor(
    @InjectModel(Syllabus.name) private syllabusModel: Model<SyllabusDocument>,
    private readonly s3Service: S3Service,
  ) { }

  async create(createSyllabusDto: CreateSyllabusDto, userId: string): Promise<Syllabus> {
    const syllabus = new this.syllabusModel({
      ...createSyllabusDto,
      uploadedBy: userId,
    });
    return syllabus.save();
  }

  async findAll(filters?: any): Promise<Syllabus[]> {
    const query = filters || {};
    return this.syllabusModel
      .find(query)
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Syllabus | null> {
    return this.syllabusModel
      .findById(id)
      .populate('uploadedBy', 'firstName lastName')
      .exec();
  }

  async update(id: string, updateSyllabusDto: UpdateSyllabusDto): Promise<Syllabus | null> {
    return this.syllabusModel
      .findByIdAndUpdate(id, updateSyllabusDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const syllabus = await this.syllabusModel.findById(id).exec();
    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    // Delete file locally using S3Service logic
    if (syllabus.fileUrl) {
      await this.s3Service.deleteFile(syllabus.fileUrl);
    }

    await this.syllabusModel.findByIdAndDelete(id).exec();
  }
}
