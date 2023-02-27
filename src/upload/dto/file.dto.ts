import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string;
}
