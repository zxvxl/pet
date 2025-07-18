const path = require('path');
const automator = require('miniprogram-automator');

describe('登录页面', () => {
  let app;

  beforeAll(async () => {
    app = await automator.launch({
      projectPath: path.resolve(__dirname, '../../frontend/miniapp'),
      cliPath: process.env.MINIPROGRAM_DEVTOOLS,
    });
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  test('展示微信登录按钮', async () => {
    const page = await app.reLaunch('/pages/login/index');
    await page.waitFor(500);
    const text = await page.$('button').text();
    expect(text).toContain('微信登录');
  });
});
