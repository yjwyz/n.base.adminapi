import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenObject } from '../common/types/jwt.type';
import { Env } from '../config/types/app.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(Env.TOKEN_SCRET),
    });
  }

  async validate(tokenObject: TokenObject) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: tokenObject.uuid,
      },
    });
    return user;
  }
}
