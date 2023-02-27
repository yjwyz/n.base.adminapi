import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, JwtStrategy],
})
export class UploadModule {}
