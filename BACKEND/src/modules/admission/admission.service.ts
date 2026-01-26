import { Injectable } from '@nestjs/common';
import { AdmissionRepository } from './admission.repository';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionStatusDto } from './dto/update-admission-status.dto';

@Injectable()
export class AdmissionService {
    constructor(private readonly admissionRepository: AdmissionRepository) { }

    async create(createAdmissionDto: CreateAdmissionDto) {
        return this.admissionRepository.create(createAdmissionDto);
    }

    async findAll(query: any = {}) {
        return this.admissionRepository.findAll(query);
    }

    async findOne(id: string) {
        return this.admissionRepository.findOne(id);
    }

    async updateStatus(id: string, updateDto: UpdateAdmissionStatusDto) {
        return this.admissionRepository.updateStatus(id, updateDto);
    }

    async remove(id: string) {
        return this.admissionRepository.remove(id);
    }
}
