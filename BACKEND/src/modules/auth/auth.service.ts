import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SuperAdmin, SuperAdminDocument } from '../../database/schemas/superadmin.schema';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { Staff, StaffDocument } from '../staff/schemas/staff.schema';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../../shared/notification.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(SuperAdmin.name) private superAdminModel: Model<SuperAdminDocument>,
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private notificationService: NotificationService,
    ) { }

    private async findUserByEmailOrPhone(identifier: string) {
        const emailLower = identifier.toLowerCase();

        let superAdmin = await this.superAdminModel.findOne({ email: emailLower, isActive: true });
        if (superAdmin) return superAdmin;

        let staff = await this.staffModel.findOne({ $or: [{ email: emailLower }, { phone: identifier }], isActive: true });
        if (staff) return staff;

        let student = await this.studentModel.findOne({ $or: [{ email: emailLower }, { phone: identifier }], isActive: true });
        if (student) return student;

        return null;
    }

    private async findUserById(id: string) {
        let user: any = await this.superAdminModel.findById(id);
        if (user) return { user, model: this.superAdminModel };

        user = await this.staffModel.findById(id);
        if (user) return { user, model: this.staffModel };

        user = await this.studentModel.findById(id);
        if (user) return { user, model: this.studentModel };

        return null;
    }

    private async findUserByRefreshToken(token: string) {
        let users: any = await this.superAdminModel.find();
        let validUser = await this.checkTokenInList(users, token);
        if (validUser) return { user: validUser, model: this.superAdminModel };

        users = await this.staffModel.find();
        validUser = await this.checkTokenInList(users, token);
        if (validUser) return { user: validUser, model: this.staffModel };

        users = await this.studentModel.find();
        validUser = await this.checkTokenInList(users, token);
        if (validUser) return { user: validUser, model: this.studentModel };

        return null;
    }

    private async checkTokenInList(users: any[], token: string) {
        for (const user of users) {
            if (user.refreshToken) {
                const isValid = await bcrypt.compare(token, user.refreshToken);
                if (isValid) return user;
            }
        }
        return null;
    }

    async validateUser(identifier: string, password: string): Promise<any> {
        const user = await this.findUserByEmailOrPhone(identifier);

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.identifier, loginDto.password);

        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: this.configService.get('jwt.accessTokenExpiry'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refreshSecret'),
            expiresIn: this.configService.get('jwt.refreshTokenExpiry'),
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        const found = await this.findUserById(user._id.toString());
        if (found) {
            found.user.refreshToken = hashedRefreshToken;
            found.user.lastLogin = new Date();
            await found.user.save();
        }

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });

            const found = await this.findUserById(payload.sub);

            if (!found || !found.user.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const isRefreshTokenValid = await bcrypt.compare(
                refreshToken,
                found.user.refreshToken,
            );

            if (!isRefreshTokenValid) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const newPayload = {
                sub: found.user._id,
                email: found.user.email,
                role: found.user.role,
            };

            const newAccessToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: this.configService.get('jwt.accessTokenExpiry'),
            });

            return {
                accessToken: newAccessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string) {
        const found = await this.findUserById(userId);
        if (found) {
            found.user.refreshToken = null as any;
            await found.user.save();
        }
        return { message: 'Logged out successfully' };
    }

    async logoutByRefreshToken(refreshToken: string) {
        const found = await this.findUserByRefreshToken(refreshToken);
        if (found) {
            found.user.refreshToken = null as any;
            await found.user.save();
        }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async getCurrentUser(userId: string) {
        const found = await this.findUserById(userId);
        if (!found) {
            throw new UnauthorizedException('User not found');
        }
        // we omit password and refreshToken logically
        const userObj = found.user.toObject ? found.user.toObject() : found.user;
        delete userObj.password;
        delete userObj.refreshToken;
        return userObj;
    }

    async changePassword(userId: string, changePasswordDto: any) {
        const found = await this.findUserById(userId);
        if (!found) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, found.user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid old password');
        }

        const hashedPassword = await this.hashPassword(changePasswordDto.newPassword);
        found.user.password = hashedPassword;
        await found.user.save();

        return { message: 'Password changed successfully' };
    }

    async forgotPassword(email: string) {
        const user = await this.findUserByEmailOrPhone(email);
        if (!user) {
            return { message: 'If the email is registered, a reset link will be sent.' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = await bcrypt.hash(resetToken, 10);

        user.resetPasswordToken = tokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        const resetUrl = `${this.configService.get('clientUrl') || process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${user.email}`;

        await this.notificationService.sendEmail(
            user.email,
            'Password Reset Request',
            `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Assalamu Alaikum ${user.firstName},</h2>
                <p>You requested a password reset. Click the link below to reset it:</p>
                <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #047857; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Jazakallah Khair,</p>
            </div>
            `
        );

        return { message: 'If the email is registered, a reset link will be sent.' };
    }

    async resetPassword(token: string, newPassword: string) {
        let validUser: any = null;

        // Note: For production with millions of users, finding all valid expiry tokens and comparing is slow. 
        // We'll iterate the models to find the user.
        for (const model of [this.superAdminModel, this.staffModel, this.studentModel] as Model<any>[]) {
            const users = await model.find({ resetPasswordExpires: { $gt: new Date() } });
            for (const user of users) {
                if (user.resetPasswordToken) {
                    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
                    if (isValid) {
                        validUser = user;
                        break;
                    }
                }
            }
            if (validUser) break;
        }

        if (!validUser) {
            throw new UnauthorizedException('Invalid or expired password reset token');
        }

        const hashedPassword = await this.hashPassword(newPassword);
        validUser.password = hashedPassword;
        validUser.resetPasswordToken = null as any;
        validUser.resetPasswordExpires = null as any;
        await validUser.save();

        return { message: 'Password has been successfully reset.' };
    }
}
