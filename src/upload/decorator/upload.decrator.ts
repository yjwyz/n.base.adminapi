import { applyDecorators, MethodNotAllowedException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

interface UploadOptions {
  maxSize: number;
  mimeType: string;
  filePath: string;
  formdataId: string;
}

export function Upload(options: UploadOptions) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(options.formdataId, {
        storage: diskStorage({
          destination: options.filePath, // 根目录中的files
          filename: (_, file, callback) => {
            const entend = extname(file.originalname);
            const proffix = entend.split('.')[1];
            const fileName = `${proffix}_${new Date().getTime() + entend}`; // 自定义文件名
            return callback(null, fileName);
          },
        }),
        limits: { fileSize: Math.pow(1024, 2) * options.maxSize },
        fileFilter(req, file, callback) {
          if (!file.mimetype.includes(options.mimeType)) {
            callback(new MethodNotAllowedException('文件类型错误'), false);
          } else {
            callback(null, true);
          }
        },
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
