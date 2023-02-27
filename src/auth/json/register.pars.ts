import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterSequence {
  @Expose()
  username: number;
  @Expose()
  createAt: string;
  constructor(options: Partial<User>) {
    Object.assign(this, options);
  }
}
