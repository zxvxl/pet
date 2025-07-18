import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { loadConfig } from '../infrastructure/config';

export interface WechatSession {
  openid: string;
  session_key: string;
}

@Injectable()
export class WechatService {
  async getSession(code: string): Promise<WechatSession> {
    const cfg = loadConfig();
    const appid = cfg.wechat.appid;
    const secret = cfg.wechat.secret;
    if (!appid || !secret) {
      throw new UnauthorizedException('Missing wechat credentials');
    }

    const resp = await axios.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      { params: { appid, secret, js_code: code, grant_type: 'authorization_code' } },
    );

    const data = resp.data;
    if (data.errcode) {
      throw new UnauthorizedException(`WeChat error: ${data.errmsg}`);
    }
    if (!data.openid || !data.session_key) {
      throw new UnauthorizedException('Invalid wechat response');
    }
    return { openid: data.openid, session_key: data.session_key };
  }
}
