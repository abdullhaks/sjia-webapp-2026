import { Injectable } from '@nestjs/common';
import { LeaveRepository } from './leave.repository';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { User } from '../../database/schemas/user.schema';

@Injectable()
export class LeaveService {
    constructor(private readonly leaveRepository: LeaveRepository) { }

    async create(user: User, createLeaveDto: CreateLeaveDto) {
        return this.leaveRepository.create(user, createLeaveDto);
    }

    async findAll() {
        return this.leaveRepository.findAll();
    }

    async findMyLeaves(userId: string) {
        return this.leaveRepository.findByUser(userId);
    }

    async updateStatus(id: string, updateDto: UpdateLeaveStatusDto) {
        return this.leaveRepository.updateStatus(id, updateDto);
    }
}
