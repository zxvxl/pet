import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

export interface JsapiPayParams {
  /** 时间戳 */
  timeStamp: string;
  /** 随机串 */
  nonceStr: string;
  /** 预支付 ID 包装 */
  package: string;
  /** 签名类型 */
  signType: string;
  /** 支付签名 */
  paySign: string;
}

@Injectable()
/**
 * 微信支付服务
 * 这里只提供简化的签名与回调解析逻辑
 */
export class WxPayService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 创建 JSAPI 支付交易
   * @param openid 用户 openid
   * @param amount 金额，单位分
   * @param outTradeNo 订单号
   */
  async createJsapiTransaction(
    openid: string,
    amount: number,
    outTradeNo: string,
  ): Promise<JsapiPayParams> {
    // Placeholder implementation. In production this should call wechatpay SDK.
    const prepayId = 'test_prepay_id';
    return this.sign(prepayId);
  }

  /**
   * 处理支付回调通知
   */
  async handleNotify(body: any, headers: Record<string, any>): Promise<{ out_trade_no: string }> {
    // Placeholder to decode and verify notify data.
    return { out_trade_no: body.out_trade_no };
  }

  /**
   * 对预支付ID进行签名
   */
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
