import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WxTemplateService {
  private readonly logger = new Logger('WxTemplate');

  async send(openId: string, templateId: string, data: any, page = '') {
    // Placeholder implementation using fetch
    const accessToken = 'ACCESS_TOKEN';
    try {
      await fetch(
        `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ touser: openId, template_id: templateId, data, page }),
        },
      );
    } catch (e) {
      this.logger.error('send template failed', e as any);
    }
  }
}
