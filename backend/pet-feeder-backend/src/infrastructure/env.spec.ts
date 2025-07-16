import { loadConfig } from './env';

describe('environment variables', () => {
  it('should load defaults for local dev', () => {
    delete process.env.CLOUD_ENV;
    delete process.env.NODE_ENV;
    const cfg = loadConfig();
    expect(cfg.nodeEnv).toBe('development');
    expect(cfg.cloudMode).toBe(false);
  });

  it('should detect cloud mode', () => {
    process.env.CLOUD_ENV = 'true';
    process.env.NODE_ENV = 'production';
    const cfg = loadConfig();
    expect(cfg.nodeEnv).toBe('production');
    expect(cfg.cloudMode).toBe(true);
  });
});
