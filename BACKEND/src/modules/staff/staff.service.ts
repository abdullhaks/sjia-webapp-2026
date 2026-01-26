import { Injectable, ConflictException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class StaffService {
    constructor(
        private readonly staffRepository: StaffRepository,
        private readonly usersService: UsersService,
    ) { }

    async create(createStaffDto: CreateStaffDto) {
        const existingStaff = await this.staffRepository.findByEmployeeId(
            createStaffDto.employeeId,
        );
        if (existingStaff) {
            throw new ConflictException(
                `Staff with employee ID ${createStaffDto.employeeId} already exists`,
            );
        }

        // Create User account
        const user = await this.usersService.createUser({
            email: createStaffDto.email || `${createStaffDto.employeeId}@sjia.edu`, // Fallback email
            password: '12341234', // Default password
            role: 'staff',
            firstName: createStaffDto.firstName,
            lastName: createStaffDto.lastName,
            isActive: true,
        });

        return this.staffRepository.create({
            ...createStaffDto,
            userId: (user as any)._id,
        });
    }

    async findAll(query: any = {}) {
        return this.staffRepository.findAll(query);
    }

    async findOne(id: string) {
        return this.staffRepository.findOne(id);
    }

    async findByUserId(userId: string) {
        return this.staffRepository.findByUserId(userId);
    }

    async update(id: string, updateStaffDto: UpdateStaffDto) {

        if(updateStaffDto.salary){
            updateStaffDto.salary = Number(updateStaffDto.salary);
        }
        return this.staffRepository.update(id, updateStaffDto);
    }

    async updateByUserId(userId: string, updateStaffDto: UpdateStaffDto) {
        const staff = await this.staffRepository.findByUserId(userId) as any; // Cast to any or StaffDocument to access _id
        if (!staff) {
            throw new ConflictException('Staff profile not found');
        }
        return this.staffRepository.update(staff._id, updateStaffDto);
    }

    async remove(id: string) {
        return this.staffRepository.remove(id);
    }
}
