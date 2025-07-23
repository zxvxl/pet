import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from '../src/admin/admin.module';
import { AdminUser } from '../src/admin/entities/admin-user.entity';
import { AdminRole } from '../src/admin/entities/admin-role.entity';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

async function createApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [AdminUser, AdminRole],
        synchronize: true,
      }),
      AdminModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  await app.init();
  return app;
}

describe('admin auth info', () => {
  let app: INestApplication;
  let server: any;
  let jwt: JwtService;

  beforeAll(async () => {
    app = await createApp();
    server = app.getHttpServer();
    jwt = app.get(JwtService);

    const roleRepo = app.get(getRepositoryToken(AdminRole));
    const userRepo = app.get(getRepositoryToken(AdminUser));
    const role = await roleRepo.save({ code: 'super', name: 'Super' } as AdminRole);
    await userRepo.save({ username: 'admin', password: 'pwd', roles: [role] } as any);
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns current admin info', async () => {
    const token = await jwt.signAsync({ sub: 1, role: 'super' });
    const res = await request(server)
      .get('/admin/auth/info')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.username).toBe('admin');
    expect(res.body.data.roles).toContain('super');
  });
});
