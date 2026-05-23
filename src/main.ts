import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('College Discovery API')
    .setDescription(
      'Production-grade REST API for college search, comparison, and admission prediction. Built with NestJS + PostgreSQL + Prisma.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'User registration and login')
    .addTag('Colleges', 'College listing, search, and detail')
    .addTag('Compare', 'Side-by-side college comparison')
    .addTag('Predictor', 'Rank-based college admission prediction')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger docs at: http://localhost:${port}/docs`);
}
bootstrap();
