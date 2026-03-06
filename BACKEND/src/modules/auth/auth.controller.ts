import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);

        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

        // 15 seconds for access token
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 1000,
        });

        // 30 days for refresh token
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return result.user; // Only return user info
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const result = await this.authService.refreshTokens(refreshToken);

        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 1000,
        });

        return { message: 'Token refreshed successfully' };
    }

    @Post('logout')
    // @UseGuards(JwtAuthGuard) // Logout should be possible even if access token expired, if we have refresh token. But if strict, keep it. 
    // Actually standard is often to allow logout if unauthenticated just to clear cookies. 
    // I'll keep UseGuards if the user wants strict session management, but usually clearing cookies is safe.
    // However, the original code had UseGuards using req.user.sub to clear from DB.
    // So I must extract user if possible. If access token expired, JwtAuthGuard fails.
    // I will try to use the guard, but if it fails, maybe the frontend just needs to hit logout to clear cookies.
    // For now, I will keep UseGuards to clear DB record.
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

        // Clear cookies with same options as creation
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        });

        return this.authService.logout(req.user.sub);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@Request() req: any) {
        return this.authService.getCurrentUser(req.user.sub);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(@Request() req: any, @Body() changePasswordDto: any) {
        return this.authService.changePassword(req.user.sub, changePasswordDto);
    }
}
