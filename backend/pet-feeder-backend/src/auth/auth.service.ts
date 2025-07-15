import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOrCreateUser(loginDto: LoginDto) {
    const user =
      (await this.usersService.findByOpenid?.(loginDto.openid)) ||
      (await this.usersService.create({
        openid: loginDto.openid,
        nickname: loginDto.nickname,
      }));
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateOrCreateUser(loginDto);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
