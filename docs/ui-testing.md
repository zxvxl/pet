# UI 层自动化测试

本文档以开发者角度介绍如何利用 [miniprogram-automator](https://github.com/wechat-miniprogram/miniprogram-automator) 对 `frontend/miniapp/` 页面进行 UI 测试。

## 环境准备
1. 确保本机安装 Node.js 18 或更新版本。
2. 安装微信开发者工具，并设置环境变量 `MINIPROGRAM_DEVTOOLS`。
   - macOS 系统示例：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli`
   - Windows 系统示例：`C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat`
3. 首次使用前，连续执行
   ```bash
   cd ui-tests
   npm install
   ```
   以安装所需测试依赖。

## 简单测试示例
`ui-tests/tests/login.spec.js` 为一个基本示例，测试登录页面是否显示“微信登录”按钮。

```javascript
const path = require('path');
const automator = require('miniprogram-automator');

describe('\u767b\u5f55\u9875\u9762', () => {
  let app;
  beforeAll(async () => {
    app = await automator.launch({
      projectPath: path.resolve(__dirname, '../../frontend/miniapp'),
      cliPath: process.env.MINIPROGRAM_DEVTOOLS,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test('\u5c55\u793a\u5fae\u4fe1\u767b\u5f55\u6309\u94ae', async () => {
    const page = await app.reLaunch('/pages/login/index');
    await page.waitFor(500);
    const text = await page.$('button').text();
    expect(text).toContain('\u5fae\u4fe1\u767b\u5f55');
  });
});
```

## 运行测试

执行
```bash
cd ui-tests
npm test
```
即可打开微信开发者工具并运行所有 UI 测试。
