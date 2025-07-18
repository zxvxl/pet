import { loadConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

describe('config loader', () => {
  it('loads from file when present', () => {
    const cfg = loadConfig();
    expect(cfg.db.database).toBe('pet_feeder');
  });

  it('falls back to defaults when file missing', () => {
    const tmp = path.join(__dirname, 'missing.json');
    const orig = process.env.APP_CONFIG_PATH;
    process.env.APP_CONFIG_PATH = tmp;
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    const cfg = loadConfig();
    expect(cfg.port).toBe(3000);
    process.env.APP_CONFIG_PATH = orig;
  });
});
