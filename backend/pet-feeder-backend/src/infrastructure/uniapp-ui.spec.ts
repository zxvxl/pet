import * as fs from 'fs';
import * as path from 'path';

describe('uni-app UI integration', () => {
  const appRoot = path.resolve(__dirname, '../../../../frontend/miniapp');

  it('ColorUI and ThorUI styles should be referenced', () => {
    const appVue = fs.readFileSync(path.join(appRoot, 'App.vue'), 'utf8');
    expect(appVue).toContain('colorui/main.css');
    expect(appVue).toContain('ThorUI/thorui.css');
    expect(fs.existsSync(path.join(appRoot, 'static/colorui/main.css'))).toBe(true);
    expect(fs.existsSync(path.join(appRoot, 'static/ThorUI/thorui.css'))).toBe(true);
  });
});
