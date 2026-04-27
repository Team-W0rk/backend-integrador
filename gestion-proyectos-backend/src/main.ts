import helmet from 'helmet'; // Van a nivel Global
import * as compression from 'compression'; // Van a nivel Global
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middlewares globales
  app.use(helmet());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(compression());
  //express-rate-limit no usamos, lo administra nginx Server

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestión de Proyectos API')
    .setDescription(
      'API del sistema de gestión de proyectos — Trabajo Final Integrador',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  // En Arch debo cambiar localhost por 0.0.0.0
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');

  logger.log(`🚀 Backend corriendo en http://localhost:${port}`);
  logger.log(`📚 Swagger disponible en http://localhost:${port}/docs`);
}

// Agrego manejo de errores en el arranque para capturar cualquier problema que pueda surgir durante la inicialización de la aplicación
bootstrap().catch((err) => {
  console.error('Error en bootstrap:', err);
  process.exit(1);
});
