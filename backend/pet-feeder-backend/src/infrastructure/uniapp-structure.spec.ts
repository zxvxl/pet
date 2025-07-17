import * as fs from 'fs';
import * as path from 'path';

describe('uni-app directory structure', () => {
  const appRoot = path.resolve(__dirname, '../../../../frontend/miniapp');

  it('pages directory exists', () => {
    expect(fs.existsSync(path.join(appRoot, 'pages'))).toBe(true);
  });

  it('pages defined in pages.json should exist', () => {
    const pagesJson = JSON.parse(fs.readFileSync(path.join(appRoot, 'pages.json'), 'utf8'));
    for (const page of pagesJson.pages) {
      const pagePath = path.join(appRoot, page.path + '.vue');
      expect(fs.existsSync(pagePath)).toBe(true);
    }
  });
});
