import axios from 'axios';
import { WechatService } from './wechat.service';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WechatService', () => {
  const service = new WechatService();

  beforeEach(() => {
    mockedAxios.get.mockReset();
    process.env.WECHAT_APPID = 'appid';
    process.env.WECHAT_SECRET = 'secret';
  });

  it('throws when code invalid', async () => {
    mockedAxios.get.mockResolvedValue({ data: { errcode: 40029, errmsg: 'invalid code' } });
    await expect(service.getSession('bad'))
      .rejects.toThrow(UnauthorizedException);
  });

  it('throws when token missing', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    await expect(service.getSession('code'))
      .rejects.toThrow(UnauthorizedException);
  });
});
