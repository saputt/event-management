import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints ?? {}),
        }));
        const messages = errors.flatMap((e) => e.messages);
        return new BadRequestException({
          statusCode: 400,
          message: messages.length === 1 ? messages[0] : 'Validation failed',
          errors,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
