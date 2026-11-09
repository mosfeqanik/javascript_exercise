import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // All routes live under /api  ->  /api/tasks, /api/tasks/:id
  app.setGlobalPrefix('api');

  // Let the Next.js frontend (different origin/port) call us from the browser.
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(','),
  });

  // Validate every incoming body against its DTO class.
  //  whitelist: strip unknown props, forbidNonWhitelisted: 400 if any are sent,
  //  transform: turn ":id" strings into numbers etc.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}
bootstrap();
