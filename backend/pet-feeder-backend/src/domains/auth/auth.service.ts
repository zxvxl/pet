import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOrCreateUser(loginDto: LoginDto) {
    let user = await this.usersService.findByOpenId?.(loginDto.openId);
    if (!user) {
      user = await this.usersService.create({
        openId: loginDto.openId,
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

  async loginWithWechat(params: {
    openid: string;
    unionid?: string;
    nickname?: string;
    avatar?: string;
  }) {
    const { openid, unionid, nickname, avatar } = params;
    let user = await this.usersService.findByOpenId(openid);
    if (!user && unionid) {
      user = await this.usersService.findByUnionId(unionid);
    }
    if (!user) {
      user = await this.usersService.create({
        openId: openid,
        unionId: unionid,
        nickname: nickname || '',
        avatar: avatar || '',
      });
    } else {
      const updated: Partial<User> = {};
      if (unionid && !user.unionId) {
        updated.unionId = unionid;
      }
      if (nickname && user.nickname !== nickname) {
        updated.nickname = nickname;
      }
      if (avatar && user.avatar !== avatar) {
        updated.avatar = avatar;
      }
      if (Object.keys(updated).length > 0) {
        await this.usersService.update(user.id, updated as any);
        Object.assign(user, updated);
      }
    }

    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { token, userInfo: user };
  }

  async profile(userId: number): Promise<User | null> {
    return this.usersService.findOne(userId);
  }
}
