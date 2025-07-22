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
    let user = await this.usersService.findByOpenid?.(loginDto.openid);
    if (!user) {
      user = await this.usersService.create({
        openid: loginDto.openid,
        nickname: loginDto.nickname,
        avatar: loginDto.avatar,
      });
    } else if (
      user.nickname !== loginDto.nickname ||
      user.avatar !== loginDto.avatar
    ) {
      await this.usersService.update(user.id, {
        nickname: loginDto.nickname,
        avatar: loginDto.avatar,
      });
      user.nickname = loginDto.nickname;
      user.avatar = loginDto.avatar;
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateOrCreateUser(loginDto);
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }
}
