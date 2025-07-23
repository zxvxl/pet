import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
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

describe('Admin user & role management (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await createApp();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates roles and users then updates roles', async () => {
    const role1 = await request(server)
      .post('/admin/roles')
      .send({ name: 'Operator', code: 'operator' })
      .expect(201);
    const role2 = await request(server)
      .post('/admin/roles')
      .send({ name: 'Super', code: 'super' })
      .expect(201);
    const r1 = role1.body.data.id;
    const r2 = role2.body.data.id;

    const userRes = await request(server)
      .post('/admin/users')
      .send({ username: 'admin', password: 'secret', roleIds: [r1, r2] })
      .expect(201);
    const id = userRes.body.data.id;
    expect(userRes.body.data.roles.length).toBe(2);

    const updateRes = await request(server)
      .post(`/admin/users/${id}/roles`)
      .send({ roleIds: [r2] })
      .expect(201);
    expect(updateRes.body.data.roles.length).toBe(1);
  });
});
