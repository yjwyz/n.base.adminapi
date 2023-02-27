import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hashSync, compareSync } from 'bcryptjs';
import { Md5 } from '../config/types/app.types';

@Injectable()
export class UtilsService {
  constructor(private readonly config: ConfigService) {}
  // todo md5加密
  md5Hash(value): string {
    return hashSync(value, this.config.get(Md5.level));
  }
  // todo md5校验
  md5Compare(value, encrypValue) {
    return compareSync(value, encrypValue);
  }
}
