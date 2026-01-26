import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email, isActive: true });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

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

        // Hash and store refresh token
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(user._id, {
            refreshToken: hashedRefreshToken,
            lastLogin: new Date(),
        });

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

            const user = await this.userModel.findById(payload.sub);

            if (!user || !user.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const isRefreshTokenValid = await bcrypt.compare(
                refreshToken,
                user.refreshToken,
            );

            if (!isRefreshTokenValid) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const newPayload = {
                sub: user._id,
                email: user.email,
                role: user.role,
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
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
        return { message: 'Logged out successfully' };
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async getCurrentUser(userId: string) {
        const user = await this.userModel.findById(userId).select('-password -refreshToken');
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async changePassword(userId: string, changePasswordDto: any) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid old password');
        }

        const hashedPassword = await this.hashPassword(changePasswordDto.newPassword);

        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
        });

        return { message: 'Password changed successfully' };
    }
}
