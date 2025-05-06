import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Invoices API')
    .setDescription('The Invoices API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('invoices')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  const darkThemeStyles = theme.getBuffer(SwaggerThemeNameEnum.DARK);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Invoices API Documentation',
    customCss: darkThemeStyles,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      filter: true,
    },
  });

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000/api');
  console.log('Swagger documentation available at http://localhost:3000/api');
}

bootstrap().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
