import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

/**
 * Creates a Winston logger configuration compatible with NestJS's WinstonModule.
 *
 * Outputs to:
 * 1. Console — colored, readable (dev & prod)
 * 2. `logs/app-%DATE%.log` — all levels, rotated daily, max 14d retention
 * 3. `logs/error-%DATE%.log` — errors only, rotated daily, max 30d retention
 */
export function createWinstonLogger() {
    const dailyTransport = new (DailyRotateFile as any)({
        dirname: logsDir,
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
    });

    const errorTransport = new (DailyRotateFile as any)({
        dirname: logsDir,
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
    });

    return WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    nestWinstonModuleUtilities.format.nestLike('SJIA', {
                        colors: true,
                        prettyPrint: true,
                    }),
                ),
            }),
            dailyTransport,
            errorTransport,
        ],
    });
}
