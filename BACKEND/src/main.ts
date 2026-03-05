import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './shared/filters/mongo-exception.filter';
import { createWinstonLogger } from './config/logger.config';

async function bootstrap() {
  const logger = createWinstonLogger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.use(cookieParser());

  // Security: Helmet for CSP, HSTS, XSS protection, etc.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploads cross-origin
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:', '*'],
          connectSrc: ["'self'", '*'],
        },
      },
    }),
  );

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173',
      process.env.CLIENT_URL,
      process.env.VERCEL_URL,
      process.env.DOMAIN_URL,
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable Mongo Exception Filters globally
  app.useGlobalFilters(new MongoExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Server is running on: http://localhost:${port}/api`);
  logger.log(`📊 MongoDB connected successfully`);
  logger.log(`📁 Static files served from: /uploads`);
  logger.log(`🛡️  Helmet security headers active`);
  logger.log(`📝 Winston file logging active → ./logs/`);
}
bootstrap();

