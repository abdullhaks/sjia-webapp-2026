import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
    constructor(@InjectConnection() private connection: Connection) { }

    @Get()
    checkHealth() {
        const dbStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
        return {
            status: 'ok',
            message: 'Server is running',
            database: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('ping')
    ping() {
        return {
            status: 'ok',
            message: 'pong',
            timestamp: new Date().toISOString(),
        };
    }
}
