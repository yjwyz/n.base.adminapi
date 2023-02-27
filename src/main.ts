import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidateExceptionFilter } from './common/fileter/exception.fileter';
import { File } from './config/static.config';
import { Response } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('vue-admin-template接口文档')
    .setDescription('模拟数据')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/admin-api', app, document);
  app.useGlobalFilters(new ValidateExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new Response());
  app.useStaticAssets(File.imageFilePath, {
    prefix: File.imageAccessProffix,
  });
  app.useStaticAssets(File.excelFilePath, {
    prefix: File.excelAccessProffix,
  });
  await app.listen(3000);
}
bootstrap();
