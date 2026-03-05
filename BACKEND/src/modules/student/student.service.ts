import { Injectable, ConflictException } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../shared/enums/roles.enum';
import { NotificationService } from '../../shared/notification.service';

@Injectable()
export class StudentService {
    constructor(
        private readonly studentRepository: StudentRepository,
        private readonly notificationService: NotificationService,
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

        // Determine password
        let plainPassword = '12341234';

        if (createStudentDto.passwordMode === 'auto') {
            // Generate a random 8-character password
            plainPassword = Math.random().toString(36).slice(-8);
        } else if (createStudentDto.passwordMode === 'manual' && createStudentDto.password) {
            plainPassword = createStudentDto.password;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        const resolvedEmail = createStudentDto.email || `${createStudentDto.admissionNumber}@sjia.edu`;

        const newStudent = await this.studentRepository.create({
            ...createStudentDto,
            email: resolvedEmail,
            password: hashedPassword,
            role: UserRole.STUDENT,
            isActive: true,
        } as any);

        // Send email if requested
        if (createStudentDto.sendEmail === 'true' || createStudentDto.sendEmail === true) {
            await this.notificationService.sendEmail(
                resolvedEmail,
                'Your Student Account has been Created',
                `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Assalamu Alaikum ${newStudent.firstName},</h2>
                    <p>Your student portal account has been successfully created.</p>
                    <p><strong>Your Login Credentials:</strong></p>
                    <ul>
                        <li><strong>Email / Admission No:</strong> ${resolvedEmail}</li>
                        <li><strong>Password:</strong> ${plainPassword}</li>
                    </ul>
                    <p>Please log in and change your password as soon as possible for security reasons.</p>
                    <p>Jazakallah Khair,</p>
                    <p><strong>SJIA Administration</strong></p>
                </div>
                `
            );
        }

        return newStudent;
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

    async addFolderItem(id: string, item: { title: string; type: 'file' | 'link'; url: string }) {
        return this.studentRepository.addFolderItem(id, item);
    }

    async removeFolderItem(id: string, itemId: string) {
        return this.studentRepository.removeFolderItem(id, itemId);
    }

    async addFolderItemUserId(userId: string, item: { title: string; type: 'file' | 'link'; url: string }) {
        const student = await this.studentRepository.findByUserId(userId) as any;
        if (!student) throw new ConflictException('Student profile not found');
        return this.studentRepository.addFolderItem(student._id.toString(), item);
    }

    async removeFolderItemUserId(userId: string, itemId: string) {
        const student = await this.studentRepository.findByUserId(userId) as any;
        if (!student) throw new ConflictException('Student profile not found');
        return this.studentRepository.removeFolderItem(student._id.toString(), itemId);
    }
}
