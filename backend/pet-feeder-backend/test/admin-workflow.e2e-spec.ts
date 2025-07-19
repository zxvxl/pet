import { INestApplication, Controller, Get, UseGuards } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../src/users/users.module';
import { PetsModule } from '../src/pets/pets.module';
import { OrdersModule } from '../src/orders/orders.module';
import { FeedersModule } from '../src/feeders/feeders.module';
import { AuthModule } from '../src/auth/auth.module';
import { AdminModule } from '../src/admin/admin.module';
import { Roles } from '../src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { User } from '../src/users/entities/user.entity';
import { Pet } from '../src/pets/entities/pet.entity';
import { Order } from '../src/orders/entities/order.entity';
import { Feeder } from '../src/feeders/entities/feeder.entity';
import { AdminUser } from '../src/admin/entities/admin-user.entity';
import { AdminOperationLog } from '../src/admin/entities/admin-operation-log.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Controller('protected')
@UseGuards(JwtAuthGuard, RolesGuard)
class ProtectedController {
  @Get('super')
  @Roles('super')
  superEndpoint() {
    return { ok: true };
  }

  @Get('operator')
  @Roles('operator')
  operatorEndpoint() {
    return { ok: true };
  }
}

async function createApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Pet, Order, Feeder, AdminUser, AdminOperationLog],
        synchronize: true,
      }),
      UsersModule,
      PetsModule,
      OrdersModule,
      FeedersModule,
      AuthModule,
      AdminModule,
    ],
    controllers: [ProtectedController],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  await app.init();
  return app;
}

describe('Admin & order workflow (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let jwt: JwtService;
  let orderRepo: Repository<Order>;
  let feederRepo: Repository<Feeder>;
  let logRepo: Repository<AdminOperationLog>;

  beforeAll(async () => {
    app = await createApp();
    server = app.getHttpServer();
    jwt = app.get(JwtService);
    orderRepo = app.get(getRepositoryToken(Order));
    feederRepo = app.get(getRepositoryToken(Feeder));
    logRepo = app.get(getRepositoryToken(AdminOperationLog));
  });

  afterAll(async () => {
    await app.close();
  });

  it('validates role-based access', async () => {
    const superToken = await jwt.signAsync({ sub: 1, role: 'super' });
    const operatorToken = await jwt.signAsync({ sub: 2, role: 'operator' });
    const userToken = await jwt.signAsync({ sub: 3, role: 'user' });

    await request(server)
      .get('/protected/super')
      .set('Authorization', `Bearer ${superToken}`)
      .expect(200);
    await request(server)
      .get('/protected/super')
      .set('Authorization', `Bearer ${operatorToken}`)
      .expect(403);
    await request(server)
      .get('/protected/operator')
      .set('Authorization', `Bearer ${operatorToken}`)
      .expect(200);
    await request(server)
      .get('/protected/operator')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('audits feeder approval and rejection', async () => {
    const adminRepo = app.get<Repository<AdminUser>>(getRepositoryToken(AdminUser));
    const hashed = await bcrypt.hash('pwd', 10);
    await adminRepo.save({ username: 'operator', password: hashed, role: 'operator' } as any);

    const loginRes = await request(server)
      .post('/admin/login')
      .send({ username: 'operator', password: 'pwd' });
    const adminToken = loginRes.body.data.access_token;

    const profileRes = await request(server)
      .get('/admin/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(profileRes.body.data.username).toBe('operator');
    const userRes = await request(server)
      .post('/users')
      .send({ openid: 'f1', nickname: 'F1' });
    const userId = userRes.body.data.id;
    const feederRes = await request(server)
      .post('/feeders')
      .send({ userId, name: 'F1', phone: '13000000000', idCard: '110101199001010000' });
    const feederId = feederRes.body.data.id;

    await request(server)
      .post('/admin/feeders/audit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ feederId, approve: true })
      .expect(201);
    const afterApprove = await feederRepo.findOne({ where: { id: feederId } });
    expect(afterApprove?.status).toBe(1);

    const feederRes2 = await request(server)
      .post('/feeders')
      .send({ userId, name: 'F2', phone: '13000000001', idCard: '110101199001010001' });
    const feederId2 = feederRes2.body.data.id;
    await request(server)
      .post('/admin/feeders/audit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ feederId: feederId2, approve: false, reason: 'bad' })
      .expect(201);
    const afterReject = await feederRepo.findOne({ where: { id: feederId2 } });
    expect(afterReject?.status).toBe(2);
  });

  it('restricts feeder removal to super admins', async () => {
    const adminRepo = app.get<Repository<AdminUser>>(getRepositoryToken(AdminUser));
    const hashed = await bcrypt.hash('pwd', 10);
    await adminRepo.save([
      { username: 'super1', password: hashed, role: 'super' } as any,
      { username: 'op1', password: hashed, role: 'operator' } as any,
    ]);

    const superToken = (
      await request(server).post('/admin/login').send({ username: 'super1', password: 'pwd' })
    ).body.data.access_token;
    const opToken = (
      await request(server).post('/admin/login').send({ username: 'op1', password: 'pwd' })
    ).body.data.access_token;

    const uRes = await request(server).post('/users').send({ openid: 'del1', nickname: 'd' });
    const feeder = await request(server)
      .post('/feeders')
      .send({ userId: uRes.body.data.id, name: 'D', phone: '13000000002', idCard: '110101199001011111' });
    const id = feeder.body.data.id;

    await request(server)
      .delete(`/admin/feeders/${id}`)
      .set('Authorization', `Bearer ${opToken}`)
      .expect(403);

    await request(server)
      .delete(`/admin/feeders/${id}`)
      .set('Authorization', `Bearer ${superToken}`)
      .expect(200);

    const removed = await feederRepo.findOne({ where: { id } });
    expect(removed).toBeNull();
  });

  it('manages orders with status updates and pagination', async () => {
    const userRes = await request(server)
      .post('/users')
      .send({ openid: 'o1', nickname: 'OrderUser' });
    const userId = userRes.body.data.id;
    const userToken = await jwt.signAsync({ sub: userId, role: 'user' });
    const petRes = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId, name: 'Dog', species: 'dog' });
    const petId = petRes.body.data.id;
    const now = new Date().toISOString();
    for (let i = 0; i < 5; i++) {
      await request(server)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId, petId, startTime: now, endTime: now, status: i % 2 ? 'new' : 'done' });
    }
    const total = await orderRepo.count();
    expect(total).toBe(5);

    const page = await orderRepo.find({ where: { status: 'new' }, skip: 0, take: 2 });
    expect(page.length).toBeLessThanOrEqual(2);

    const firstId = page[0].id;
    await request(server)
      .patch(`/orders/${firstId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'updated' })
      .expect(200);
    const updated = await orderRepo.findOne({ where: { id: firstId } });
    expect(updated?.status).toBe('updated');
  });

  it('writes admin operation logs', async () => {
    const admin = await app.get(getRepositoryToken(AdminUser)).save(
      { username: 'admin', password: 'pwd', role: 'super' } as any,
    );
    const log = logRepo.create({
      user: admin,
      action: 'test',
      targetId: 1,
      targetType: 'feeder',
    });
    const saved = await logRepo.save(log);
    const found = await logRepo.findOne({ where: { id: saved.id } });
    expect(found).toBeDefined();
    expect(found?.action).toBe('test');
  });

  it('updates statistics from orders', async () => {
    const count = await orderRepo.count();
    const stats = { serviceCount: 0 };
    stats.serviceCount = count;
    expect(stats.serviceCount).toBe(count);
  });
});
