import { registerAs } from '@nestjs/config';

export default registerAs('wechat', () => ({
  appid: process.env.WX_APPID ?? '',
  secret: process.env.WX_SECRET ?? '',
  payKey: process.env.WX_PAY_KEY ?? '',
}));
