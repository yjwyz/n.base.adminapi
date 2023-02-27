import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TokenObject } from '../common/types/jwt.type';
import { PrismaService } from '../prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { AddMenusDto, AddRolesDto, addRoleToMenu, addUserToRoleDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly jwt: JwtService,
  ) {}

  // todo 获取所有角色
  async getAllRoles() {
    const role = await this.prisma.role.findMany();
    return role;
  }

  // todo 获取所有菜单
  async getAllMenus() {
    const menus = await this.prisma.menu.findMany();
    return menus;
  }

  // todo 为某角色添加菜单
  async addRoleToMenu(data: addRoleToMenu) {
    const role = await this.prisma.role.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: data.roleId,
      },
    });

    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    // 去重
    const menusData = [...new Set(data.menus)];

    // 过滤掉不存在的菜单id
    const muens = await this.prisma.menu.findMany({
      select: {
        id: true,
      },
    });

    const setMuens = menusData.filter((e) => {
      const index = muens.findIndex((item) => item.id === e);
      return index >= 0;
    });

    // 过滤掉menuChild中已经存在的
    const menuChildList = await this.prisma.menuChild.findMany({
      select: {
        menuId: true,
      },
      where: {
        roleId: data.roleId,
        OR: setMuens.map((e) => ({ menuId: e })),
      },
    });

    // 得到最后剩下的id
    const lastMenus = setMuens.filter((e) => {
      const index = menuChildList.findIndex((item) => item.menuId === e);
      return index < 0;
    });

    const result = await this.prisma.menuChild.createMany({
      data: lastMenus.map((e) => ({
        roleId: data.roleId,
        menuId: e,
      })),
      skipDuplicates: true,
    });

    return `角色${role.name}添加菜单结果,成功:${result.count},失败:${
      data.menus.length - lastMenus.length
    },请确保失败的那些菜单id已经存在`;
  }

  // todo 为某用户添加角色
  async addUserToRole(data: addUserToRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 去重
    const rolesData = [...new Set(data.roles)];

    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
      },
    });
    // 筛选出用户中存在的
    const addroles = rolesData.filter((e) => {
      const index = roles.findIndex((item) => item.id === e);
      return index >= 0;
    });

    // 筛选出roleChild里不重复的
    const setResult = await this.prisma.roleChild.findMany({
      select: { roleId: true },
      where: {
        userId: data.id,
        OR: addroles.map((e) => ({ roleId: e })),
      },
    });

    // 得到最后不重复的用户id
    const lastRoles = addroles.filter((e) => {
      const index = setResult.findIndex((item) => item.roleId === e);
      return index < 0;
    });

    const result = await this.prisma.roleChild.createMany({
      data: lastRoles.map((e) => ({
        roleId: e,
        userId: data.id,
      })),
      skipDuplicates: true, // 忽略重复的
    });
    return `用户${user.username}添加角色结果,成功:${result.count},失败:${
      data.roles.length - lastRoles.length
    },请确保失败的那些角色id已经存在`;
  }

  // todo 查用户的角色信息
  async readRoleInfo(id: number) {
    // 拥有的角色
    const result = await this.prisma.roleChild.findMany({
      select: {
        roleId: true,
      },
      where: {
        userId: id,
      },
    });
    if (result.length <= 0) {
      return {
        roles: [],
        menus: [],
      };
    }
    const roles = await this.prisma.role.findMany({
      select: {
        name: true,
        id: true,
      },
      where: {
        OR: result.map((e) => ({ id: e.roleId })),
      },
    });
    // 拥有的菜单
    const mens = await this.prisma.menuChild.findMany({
      select: {
        menuId: true,
      },
      where: {
        OR: roles.map((e) => ({ roleId: e.id })),
      },
    });
    const mensrsult = await this.prisma.menu.findMany({
      select: {
        name: true,
      },
      where: {
        OR: mens.map((v) => ({ id: v.menuId })),
      },
    });
    return {
      roles: roles.map((v) => v.name),
      menus: mensrsult.map((v) => v.name),
    };
  }

  // todo 获取用户名单
  async readAllUser() {
    const result = await this.prisma.user.findMany({
      select: {
        nickName: true,
        id: true,
        email: true,
        username: true,
        roleChild: {
          select: {
            roleId: true,
          },
        },
      },
    });
    return {
      total: result.length,
      data: result,
    };
  }

  // todo 添加菜单
  async addMenus(menus: AddMenusDto) {
    const result = await this.prisma.menu.createMany({
      data: menus.menus.map((e) => ({
        name: e,
      })),
      skipDuplicates: true,
    });

    return `成功添加了${result.count}个菜单`;
  }

  // todo 添加角色
  async addRoles(roles: AddRolesDto) {
    const result = await this.prisma.role.createMany({
      data: roles.roles.map((e) => ({
        name: e,
      })),
      skipDuplicates: true,
    });

    return `成功添加了${result.count}个角色`;
  }

  // todo 获取用户信息
  async getUserInfo(user: User) {
    const roles_r = [];
    const menu_r = [];
    const roles = await this.prisma.roleChild.findMany({
      where: {
        userId: user.id,
      },
    });
    if (roles.length) {
      for (let k = 0, len = roles.length; k < len; k++) {
        const item = roles[k];
        roles_r.push(item.roleId);
        // ===== 根据拥有的角色查找菜单
        const menus = await this.prisma.menuChild.findMany({
          where: {
            roleId: item.id,
          },
        });
        if (menus.length) {
          for (let c = 0, len = menus.length; c < len; c++) {
            menu_r.push(menus[c].menuId);
          }
        }
        // =====
      }
    }

    return {
      userinfo: user,
      roles: roles_r,
      menus: menu_r,
    };
  }

  // todo 登录
  async login(userBody: RegisterDto) {
    const user = await this.findUser(userBody.username);

    if (!user) {
      throw new BadRequestException('账号不存在');
    }

    const check = this.isPassCheck(userBody.password, user.password);

    if (!check) {
      throw new BadRequestException('密码不正确');
    }

    return this.createToken(user);
  }

  // todo 注册
  async register(userBody: RegisterDto) {
    const user = await this.findUser(userBody.username);
    if (user) {
      // 如果已经存在,抛出错误
      throw new BadRequestException('该账号已经存在');
    } else {
      // 否则进行创建
      const userUser = await this.prisma.user.create({
        data: {
          username: userBody.username,
          password: this.utils.md5Hash(userBody.password),
        },
      });
      return userUser;
    }
  }

  // todo 创建一个token
  async createToken(user: User) {
    const token = await this.jwt.signAsync({
      name: user.username,
      uuid: user.id,
    } as TokenObject);
    return {
      token,
    };
  }

  // 查找该账号是否存在
  findUser(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  // 密码是否正确
  isPassCheck(userPass: string, sqlPass: string) {
    return this.utils.md5Compare(userPass, sqlPass);
  }
}
