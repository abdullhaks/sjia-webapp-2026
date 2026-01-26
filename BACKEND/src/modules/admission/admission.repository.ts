import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admission, AdmissionDocument, AdmissionStatus } from './schemas/admission.schema';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionStatusDto } from './dto/update-admission-status.dto';

@Injectable()
export class AdmissionRepository {
    constructor(
        @InjectModel(Admission.name) private admissionModel: Model<AdmissionDocument>,
    ) { }

    async create(createAdmissionDto: CreateAdmissionDto): Promise<Admission> {
        const createdAdmission = new this.admissionModel(createAdmissionDto);
        return createdAdmission.save();
    }

    async findAll(query: any = {}): Promise<Admission[]> {
        return this.admissionModel.find(query).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Admission> {
        const admission = await this.admissionModel.findById(id).exec();
        if (!admission) {
            throw new NotFoundException(`Admission with ID ${id} not found`);
        }
        return admission;
    }

    async findByApplicationId(applicationId: string): Promise<Admission | null> {
        return this.admissionModel.findOne({ applicationId }).exec();
    }

    async updateStatus(id: string, updateDto: UpdateAdmissionStatusDto): Promise<Admission> {
        const admission = await this.admissionModel
            .findByIdAndUpdate(
                id,
                {
                    status: updateDto.status,
                    notes: updateDto.notes
                },
                { new: true }
            )
            .exec();

        if (!admission) {
            throw new NotFoundException(`Admission with ID ${id} not found`);
        }
        return admission;
    }

    async remove(id: string): Promise<Admission> {
        const deleted = await this.admissionModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Admission with ID ${id} not found`);
        }
        return deleted;
    }
}
