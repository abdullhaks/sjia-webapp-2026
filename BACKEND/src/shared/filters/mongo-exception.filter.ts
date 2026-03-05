import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb'; // MongoDB core error
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Handle Duplicate Key Errors (E11000)
        if (exception.code === 11000) {
            const fieldRegex = /index: (?:.*\.)?([a-zA-Z0-9_]+)_1 dup key/;
            const match = exception.message.match(fieldRegex);
            const field = match ? match[1] : 'field';

            const formattedErrors: Record<string, string> = {};
            formattedErrors[field] = `This ${field} is already in use. Please enter a different one.`;

            return response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: 'Duplicate Entry Found',
                errors: formattedErrors,
            });
        }

        // Forward other Mongo errors as Internal Server Error
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal database error',
        });
    }
}
