import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserInfoSequence {
  @Exclude()
  password: string;
  constructor(options: Partial<User>) {
    Object.assign(this, options);
  }
}
