import { Injectable, ConflictException } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../shared/enums/roles.enum';
import { NotificationService } from '../../shared/notification.service';

@Injectable()
export class StaffService {
    constructor(
        private readonly staffRepository: StaffRepository,
        private readonly notificationService: NotificationService,
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

        // Determine password
        let plainPassword = '12341234';

        if (createStaffDto.passwordMode === 'auto') {
            // Generate a random 8-character password
            plainPassword = Math.random().toString(36).slice(-8);
        } else if (createStaffDto.passwordMode === 'manual' && createStaffDto.password) {
            plainPassword = createStaffDto.password;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        const resolvedEmail = createStaffDto.email || `${createStaffDto.employeeId}@sjia.edu`;

        const newStaff = await this.staffRepository.create({
            ...createStaffDto,
            email: resolvedEmail,
            password: hashedPassword,
            role: UserRole.STAFF,
            isActive: true,
        } as any);

        // Send email if requested
        if (createStaffDto.sendEmail === 'true' || createStaffDto.sendEmail === true) {
            await this.notificationService.sendEmail(
                resolvedEmail,
                'Your Staff Account has been Created',
                `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Assalamu Alaikum ${newStaff.firstName},</h2>
                    <p>Your SJIA staff portal account has been successfully created.</p>
                    <p><strong>Your Login Credentials:</strong></p>
                    <ul>
                        <li><strong>Email / Employee ID:</strong> ${resolvedEmail}</li>
                        <li><strong>Password:</strong> ${plainPassword}</li>
                    </ul>
                    <p>Please log in and change your password as soon as possible for security reasons.</p>
                    <p>Jazakallah Khair,</p>
                    <p><strong>SJIA Administration</strong></p>
                </div>
                `
            );
        }

        return newStaff;
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

        if (updateStaffDto.salary) {
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
