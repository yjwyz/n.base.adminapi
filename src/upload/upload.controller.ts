import { BadRequestException, Controller, Param, ParseIntPipe, Request, Res, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetDecorator, JwtDecorator, PostDecorator } from '../common/decorator/api.decrator';
import { File } from '../config/static.config';
import { Upload } from './decorator/upload.decrator';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('文件管理')
@ApiBearerAuth()
@JwtDecorator()
export class UploadController {
  constructor(private readonly upload: UploadService, private readonly config: ConfigService) {}

  @GetDecorator('excelList/:userId', '查某用户的excel列表')
  readExcelList(@Param('userId', ParseIntPipe) userId: number) {
    return this.upload.readExcelList(userId);
  }

  @GetDecorator('imageList/:userId', '查某用户的images列表')
  readImageList(@Param('userId', ParseIntPipe) userId: number) {
    return this.upload.readImageList(userId);
  }

  @GetDecorator('downBlobImage/:imageId', '下载图片二进制')
  async downloadImage(@Param('imageId', ParseIntPipe) imageId: number, @Res() res: Response) {
    const image = await this.upload.readFileInfo(imageId, File.imageFileFormDataId);
    const url = File.imageFilePath + '\\' + image.newName;
    return res.download(url);
  }

  @GetDecorator('downBlobExcel/:excelId', '下载Excel二进制')
  async downloadExcel(@Param('excelId', ParseIntPipe) excelId: number, @Res() res: Response) {
    const excel = await this.upload.readFileInfo(excelId, File.excelFileFormDataId);
    const url = File.excelFilePath + '\\' + excel.newName;
    return res.download(url);
  }

  @Upload({
    formdataId: File.imageFileFormDataId,
    filePath: File.imageFilePath,
    maxSize: File.imageMaxSizeLimit,
    mimeType: File.imageFileMimeType,
  })
  @PostDecorator('avatar', '修改头像______________(需要token)')
  setAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('上传失败');
    }
    const url = File.imageAccessProffix + '/' + file.filename;
    return this.upload.updateAvatar(req.user.id, url);
  }

  @Upload({
    formdataId: File.excelFileFormDataId,
    filePath: File.excelFilePath,
    maxSize: File.excelMaxSizeLimit,
    mimeType: File.excelFileMimeType,
  })
  @PostDecorator('upExcel', '上传excel______________(需要token)')
  upExcel(@UploadedFile() file_: Express.Multer.File, @Request() req) {
    if (!file_) {
      throw new BadRequestException('上传失败');
    }
    const url = File.excelAccessProffix + '/' + file_.filename;
    return this.upload.saveExcel(url, req.user.id, file_.originalname, file_.filename);
  }

  @Upload({
    formdataId: File.imageFileFormDataId,
    filePath: File.imageFilePath,
    maxSize: File.imageMaxSizeLimit,
    mimeType: File.imageFileMimeType,
  })
  @PostDecorator('upImage', '上传Image______________(需要token)')
  upImage(@UploadedFile() file_: Express.Multer.File, @Request() req) {
    if (!file_) {
      throw new BadRequestException('上传失败');
    }
    const url = File.imageAccessProffix + '/' + file_.filename;
    return this.upload.saveImage(url, req.user.id, file_.originalname, file_.filename);
  }
}
