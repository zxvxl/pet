import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

export interface JsapiPayParams {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

@Injectable()
export class WxPayService {
  constructor(private readonly config: ConfigService) {}

  async createJsapiTransaction(
    openid: string,
    amount: number,
    outTradeNo: string,
  ): Promise<JsapiPayParams> {
    // Placeholder implementation. In production this should call wechatpay SDK.
    const prepayId = 'test_prepay_id';
    return this.sign(prepayId);
  }

  async handleNotify(body: any, headers: Record<string, any>): Promise<{ out_trade_no: string }> {
    // Placeholder to decode and verify notify data.
    return { out_trade_no: body.out_trade_no };
  }

  private sign(prepayId: string): JsapiPayParams {
    const timeStamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = randomBytes(16).toString('hex');
    return {
      timeStamp,
      nonceStr,
      package: `prepay_id=${prepayId}`,
      signType: 'RSA',
      paySign: 'sign',
    };
  }
}
