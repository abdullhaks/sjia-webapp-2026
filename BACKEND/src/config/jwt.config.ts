import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
    const parseExpiry = (val: string | undefined, defaultVal: string) => {
        const value = val || defaultVal;
        return isNaN(Number(value)) ? value : Number(value);
    };

    return {
        secret: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'SJIA_accesstokensecret',
        accessTokenExpiry: parseExpiry(process.env.ACCESS_TOKEN_EXPIRY || process.env.JWT_EXPIRE, '1h'),
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'SJIA_refreshtokensecret',
        refreshTokenExpiry: parseExpiry(process.env.REFRESH_TOKEN_EXPIRY, '30d'),
    };
});