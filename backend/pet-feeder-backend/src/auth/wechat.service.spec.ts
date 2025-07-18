import axios from 'axios';
import { WechatService } from './wechat.service';
import { UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WechatService', () => {
  const service = new WechatService();

  const tmp = path.join(__dirname, 'wechat.test.json');

  beforeEach(() => {
    mockedAxios.get.mockReset();
    fs.writeFileSync(tmp, JSON.stringify({ wechat: { appid: 'appid', secret: 'secret' } }));
    process.env.APP_CONFIG_PATH = tmp;
  });

  afterEach(() => {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    delete process.env.APP_CONFIG_PATH;
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
