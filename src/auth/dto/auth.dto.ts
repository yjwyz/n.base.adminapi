import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class AddRolesDto {
  @ArrayNotEmpty({ message: 'roles不能为空' })
  @ArrayMinSize(1, { message: 'roles长度不能少于1' })
  @ApiProperty({ type: [String], isArray: true, example: ['admin', 'sdf'] })
  roles: string[];
}

export class AddMenusDto {
  @MinLength(1, {
    message: '长度不能少于1',
    each: true,
  })
  @ApiProperty({ type: [String], isArray: true, example: ['menu1', 'menu2'] })
  menus: string[];
}

export class Item {
  @IsNumber()
  name: number;
}

export class addUserToRoleDto {
  @IsNotEmpty({ message: '用户id不能为空' })
  @ApiProperty({ description: '用户id' })
  id: number;

  @ArrayNotEmpty({ message: 'roles不能为空' })
  @ArrayMinSize(1, { message: 'roles长度不能少于1' })
  @ArrayMaxSize(6, { message: 'roles长度不能超过6' })
  @ApiProperty({ description: '需要添加的角色id', type: [Number], isArray: true, example: [0] })
  @Type(() => Number)
  roles: [number];
}

export class addRoleToMenu {
  @IsNotEmpty({ message: 'roleId不能为空' })
  @ApiProperty({ description: '角色id' })
  roleId: number;

  @ArrayNotEmpty({ message: 'menus不能为空' })
  @ArrayMinSize(1, { message: 'menus长度不能少于1' })
  @ArrayMaxSize(6, { message: 'menus长度不能超过6' })
  @ApiProperty({ description: '需要添加的菜单id', type: [Number], isArray: true, example: [0] })
  @Type(() => Number)
  menus: [number];
}
