import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { SwaggerConfig } from './config/configuration.interface';
import { PrismaService } from './prisma/prisma.service';
import { AppModule } from './app.module';
import getLogLevels from './getLogLevels';
import { exit } from 'process';

const logger = new Logger();

process.on('unhandledRejection', (err: PromiseRejectedResult) => {
  console.log(err);
  logger.error(`Unhandled promise rejection reason: ${err?.reason}`);
  exit(1);
});

process.on('SIGTERM', async () => {
  logger.log('SIGTERM sent to process.');
  exit(0);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  app.enableCors();
  app.use(helmet());
  app.use(helmet.frameguard({ action: 'deny' })); // Prevent any iframes
  app.use(helmet.hsts({ maxAge: 63072000 })); // Two years
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refresh-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(configService.get('port'));
  logger.log(`Ready on port ${configService.get('port')}`);
}
bootstrap();
