import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  ParseIntPipe,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetDecorator, JwtDecorator, PostDecorator } from '../common/decorator/api.decrator';
import { AuthService } from './auth.service';
import { AddMenusDto, AddRolesDto, addRoleToMenu, addUserToRoleDto, RegisterDto } from './dto/auth.dto';
import { RegisterSequence } from './json/register.pars';
import { UserInfoSequence } from './json/uersinfo.pars';

@Controller('auth')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor) // 控制器上方导入
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('用户模块')
  @JwtDecorator()
  @GetDecorator('userinfo', '获取用户信息______________(需要token)')
  async getUserInfo(@Request() req) {
    const result = await this.authService.getUserInfo(req.user);
    return {
      userinfo: new UserInfoSequence(result.userinfo),
      roles: result.roles,
      menus: result.menus,
    };
  }

  @ApiTags('用户模块')
  @PostDecorator('register', '注册账号')
  async register(@Body() user: RegisterDto) {
    const result = await this.authService.register(user);
    return new RegisterSequence(result);
  }

  @ApiTags('用户模块')
  @PostDecorator('login', '登录账号')
  async login(@Body() user: RegisterDto) {
    return this.authService.login(user);
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @GetDecorator('getAllMenus', '获取所有菜单______________(需要token)')
  async getAllMenus() {
    return this.authService.getAllMenus();
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @GetDecorator('readAllUser', '获取用户名单______________(需要token)')
  async readAllUser() {
    return this.authService.readAllUser();
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @GetDecorator('readRoleInfo/:id', '查某用户的角色信息______________(需要token)')
  async readRoleInfo(@Param('id', ParseIntPipe) id: number) {
    return this.authService.readRoleInfo(id);
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @GetDecorator('getAllRoles', '获取所有角色______________(需要token)')
  async getAllRoles() {
    return this.authService.getAllRoles();
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @PostDecorator('addRole', '添加角色______________(需要token)')
  async addRole(@Body() roles: AddRolesDto) {
    return this.authService.addRoles(roles);
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @PostDecorator('addMenu', '添加菜单______________(需要token)')
  async addMenu(@Body() menus: AddMenusDto) {
    return this.authService.addMenus(menus);
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @PostDecorator('addUserToRole', '为某用户添加角色______________(需要token)')
  async addUserToRole(@Body() data: addUserToRoleDto) {
    return this.authService.addUserToRole(data);
  }

  @ApiTags('角色模块')
  @JwtDecorator()
  @PostDecorator('addRoleToMenu', '为某角色添加菜单______________(需要token)')
  async addRoleToMenu(@Body() data: addRoleToMenu) {
    return this.authService.addRoleToMenu(data);
  }
}
