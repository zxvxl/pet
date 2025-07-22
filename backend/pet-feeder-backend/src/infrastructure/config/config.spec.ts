import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './database.config';

describe('config module', () => {
  it('loads values from env', async () => {
    process.env.DB_NAME = 'pet_feeder';
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
    }).compile();
    const cfg = moduleRef.get(ConfigService);
    expect(cfg.get<string>('database.name')).toBe('pet_feeder');
  });
});
