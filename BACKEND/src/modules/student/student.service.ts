import { Injectable, ConflictException } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly usersService: UsersService,
    ) { }

    async create(createStudentDto: CreateStudentDto) {
        const existingStudent = await this.studentRepository.findByAdmissionNumber(
            createStudentDto.admissionNumber,
        );
        if (existingStudent) {
            throw new ConflictException(
                `Student with admission number ${createStudentDto.admissionNumber} already exists`,
            );
        }

        // Create User account
        const user = await this.usersService.createUser({
            email: createStudentDto.email || `${createStudentDto.admissionNumber}@sjia.edu`, // Fallback email
            password: '12341234', // Default password
            role: 'student',
            firstName: createStudentDto.firstName,
            lastName: createStudentDto.lastName,
            isActive: true,
        });

        return this.studentRepository.create({
            ...createStudentDto,
            userId: (user as any)._id,
        });
    }

    async findAll(query: any = {}) {
        return this.studentRepository.findAll(query);
    }

    async findOne(id: string) {
        return this.studentRepository.findOne(id);
    }

    async findByUserId(userId: string) {
        return this.studentRepository.findByUserId(userId);
    }

    async findCouncilMembers() {
        return this.studentRepository.findCouncilMembers();
    }

    async update(id: string, updateStudentDto: UpdateStudentDto) {
        return this.studentRepository.update(id, updateStudentDto);
    }

    async updateByUserId(userId: string, updateStudentDto: UpdateStudentDto) {
        const student = await this.studentRepository.findByUserId(userId) as any;
        if (!student) {
            throw new ConflictException('Student profile not found');
        }
        return this.studentRepository.update(student._id, updateStudentDto);
    }

    async remove(id: string) {
        return this.studentRepository.remove(id);
    }
}
