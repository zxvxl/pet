import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { WechatService } from './wechat.service';
import { WxLoginDto } from './dto/wx-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly wechatService: WechatService,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('wx-login')
  async wxLogin(@Body() wxLoginDto: WxLoginDto) {
    const { code, nickname, avatar } = wxLoginDto;
    const { openid, unionid } = await this.wechatService.getSession(code);
    const { token, userInfo } = await this.authService.loginWithWechat({
      openid,
      unionid,
      nickname,
      avatar,
    });
    return { token, userInfo };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req) {
    return this.authService.profile(req.user.userId);
  }
}
