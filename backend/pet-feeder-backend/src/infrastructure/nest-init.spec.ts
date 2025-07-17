import * as fs from 'fs';
import * as path from 'path';

const backendRoot = path.resolve(__dirname, '../..');

describe('NestJS project initialization', () => {
  it('dependencies should be installed', () => {
    const pkgPath = path.join(backendRoot, 'node_modules', '@nestjs', 'core', 'package.json');
    expect(fs.existsSync(pkgPath)).toBe(true);
  });

  it('start script should be defined', () => {
    const pkg = require(path.join(backendRoot, 'package.json'));
    expect(pkg.scripts && pkg.scripts.start).toBeDefined();
  });
});
