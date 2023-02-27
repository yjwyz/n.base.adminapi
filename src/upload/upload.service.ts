import { BadRequestException, Injectable } from '@nestjs/common';
import { File } from '../config/static.config';
import { PrismaService } from '../prisma/prisma.service';

interface SavaFileOptionsType {
  url: string;
  type: string;
  userId: number;
  oldName: string;
  newName: string;
}
interface ReadFileListOptionsType {
  userId: number;
  type: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  // todo 获取文件信息
  async readFileInfo(fileId: number, fileType: string) {
    const image = await this.prisma.fileChild.findFirst({
      select: {
        newName: true,
      },
      where: {
        id: fileId,
        type: fileType,
      },
    });
    if (!image) {
      throw new BadRequestException('此文件不存在');
    }

    return image;
  }

  // todo 查excel列表
  async readExcelList(userId: number) {
    const check = await this.sqlHasUser(userId);
    if (!check) {
      throw new BadRequestException('用户不存在');
    }
    const result = await this.readfileList({
      userId: userId,
      type: File.excelFileFormDataId,
    });
    return result;
  }

  // todo 查images列表
  async readImageList(userId: number) {
    const check = await this.sqlHasUser(userId);
    if (!check) {
      throw new BadRequestException('用户不存在');
    }
    const result = await this.readfileList({
      userId: userId,
      type: File.imageFileFormDataId,
    });
    return result;
  }

  // todo 查某用户的文件列表
  readfileList(options: ReadFileListOptionsType) {
    return this.prisma.fileChild.findMany({
      where: {
        userId: options.userId,
        type: options.type,
      },
    });
  }

  // todo 上传头像
  async updateAvatar(id: number, url: string) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: File.toHttp + url,
      },
    });
    return File.toHttp + url;
  }

  // todo 保存excel文件
  async saveExcel(url: string, userId: number, oldName: string, newName: string) {
    const result = await this.saveFile({
      url: File.toHttp + url,
      userId: userId,
      oldName: oldName,
      newName: newName,
      type: File.excelFileFormDataId,
    });
    return {
      message: '上传成功',
      data: result,
    };
  }
  // todo 保存image文件
  async saveImage(url: string, userId: number, oldName: string, newName: string) {
    const result = await this.saveFile({
      url: File.toHttp + url,
      userId: userId,
      oldName: oldName,
      newName: newName,
      type: File.imageFileFormDataId,
    });
    return {
      message: '上传成功',
      data: result,
    };
  }
  // todo 保存文件
  saveFile(options: SavaFileOptionsType) {
    return this.prisma.fileChild.create({
      data: {
        url: options.url,
        type: options.type,
        oldName: options.oldName,
        newName: options.newName,
        userId: options.userId,
      },
    });
  }
  // todo 数据库是否存在该用户
  sqlHasUser(userId: number) {
    return this.prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });
  }
}
