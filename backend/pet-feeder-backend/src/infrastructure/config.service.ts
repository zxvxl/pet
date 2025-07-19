import { Injectable } from '@nestjs/common';
import { loadConfig } from './config';

@Injectable()
export class ConfigService {
  private readonly cfg = loadConfig();

  get wechatPay() {
    return (this.cfg as any).wechatPay || {};
  }
}
