import { applyDecorators, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

export function PostDecorator(url, name: string) {
  return applyDecorators(Post(url), ApiOperation({ summary: name }));
}

export function GetDecorator(url, name: string) {
  return applyDecorators(Get(url), ApiOperation({ summary: name }));
}

export function JwtDecorator() {
  return applyDecorators(UseGuards(AuthGuard('jwt')));
}
