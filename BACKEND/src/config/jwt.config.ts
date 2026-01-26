import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.ACCESS_TOKEN_SECRET || 'SJIA_accesstokensecret',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'SJIA_refreshtokensecret',
    accessTokenExpiry: process.env.NODE_ENV === 'production' ? '15m' : '4s',
    refreshTokenExpiry: '7d',
}));
