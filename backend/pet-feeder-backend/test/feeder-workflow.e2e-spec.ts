import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { PetsModule } from '../src/pets/pets.module';
import { OrdersModule } from '../src/orders/orders.module';
import { FeedersModule } from '../src/feeders/feeders.module';
import { ServiceOrdersModule } from '../src/service-orders/service-orders.module';
import { TrackingModule } from '../src/tracking/tracking.module';
import { AuthModule } from '../src/auth/auth.module';
import { AdminModule } from '../src/admin/admin.module';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { User } from '../src/users/entities/user.entity';
import { Pet } from '../src/pets/entities/pet.entity';
import { Order } from '../src/orders/entities/order.entity';
import { Feeder } from '../src/feeders/entities/feeder.entity';
import { ServiceOrder } from '../src/service-orders/entities/service-order.entity';
import { FeederLocation } from '../src/tracking/entities/feeder-location.entity';
import { EmergencyCall } from '../src/im/entities/emergency-call.entity';
import { AdminUser } from '../src/admin/entities/admin-user.entity';
import { AdminOperationLog } from '../src/admin/entities/admin-operation-log.entity';
import { ServiceStatus } from '../src/service-orders/status.enum';
import { WxTemplateService } from '../src/tracking/wx-template.service';

async function createTestApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [
          User,
          Pet,
          Order,
          Feeder,
          ServiceOrder,
          FeederLocation,
          EmergencyCall,
          AdminUser,
          AdminOperationLog,
        ],
        synchronize: true,
      }),
      UsersModule,
      PetsModule,
      OrdersModule,
      FeedersModule,
      ServiceOrdersModule,
      TrackingModule,
      AuthModule,
      AdminModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  await app.init();
  return app;
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

describe('Feeder workflow (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    const wxService = app.get(WxTemplateService);
    jest.spyOn(wxService, 'send').mockResolvedValue(undefined);
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ openid: 'user', nickname: 'user' });
    token = loginRes.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register, approve and finish service with images', async () => {
    const userRes = await request(server)
      .post('/users')
      .send({ openid: 'feeder1', nickname: 'feeder1' });
    const feederRes = await request(server)
      .post('/feeders')
      .send({
        userId: userRes.body.data.id,
        name: 'Feeder 1',
        phone: '13900000000',
        idCard: '110101199001010000',
      });
    const feederId = feederRes.body.data.id;

    await request(server)
      .patch(`/feeders/${feederId}/status/1`)
      .send();

    const ownerRes = await request(server)
      .post('/users')
      .send({ openid: 'owner', nickname: 'owner' });
    const petRes = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: ownerRes.body.data.id, name: 'cat', species: 'cat' });
    const orderRes = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: ownerRes.body.data.id,
        petId: petRes.body.data.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'paid',
      });
    const orderId = orderRes.body.data.id;

    const serviceRes = await request(server)
      .post('/service-orders')
      .send({ feederId, orderId });
    const serviceId = serviceRes.body.data.id;
    expect(serviceRes.body.data.status).toBe(ServiceStatus.ACCEPTED);

    await request(server)
      .patch(`/service-orders/${serviceId}/depart`)
      .send();
    await request(server)
      .patch(`/service-orders/${serviceId}/sign-in`)
      .send({ lat: 30.1, lng: 120.2 });
    await request(server)
      .patch(`/service-orders/${serviceId}/start`)
      .send();
    await request(server)
      .patch(`/service-orders/${serviceId}/complete`)
      .send({ description: 'ok', images: ['a.jpg'] });

    const detail = await request(server).get(`/service-orders/${serviceId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.COMPLETED);
    expect(detail.body.data.completeImages).toContain('a.jpg');
  });

  it('should transition status correctly', async () => {
    const uRes = await request(server)
      .post('/users')
      .send({ openid: 'feeder2', nickname: 'feeder2' });
    const fRes = await request(server)
      .post('/feeders')
      .send({
        userId: uRes.body.data.id,
        name: 'Feeder 2',
        phone: '13900000001',
        idCard: '110101199001010001',
      });
    const feederId = fRes.body.data.id;

    await request(server).patch(`/feeders/${feederId}/status/1`).send();

    const ownerRes = await request(server)
      .post('/users')
      .send({ openid: 'owner2', nickname: 'owner2' });
    const petRes = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: ownerRes.body.data.id, name: 'dog', species: 'dog' });
    const orderRes = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: ownerRes.body.data.id,
        petId: petRes.body.data.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'paid',
      });
    const orderId = orderRes.body.data.id;

    const serviceRes = await request(server)
      .post('/service-orders')
      .send({ feederId, orderId });
    const sid = serviceRes.body.data.id;

    await request(server).patch(`/service-orders/${sid}/depart`).send();
    let detail = await request(server).get(`/service-orders/${sid}`);
    expect(detail.body.data.status).toBe(ServiceStatus.DEPARTED);

    await request(server)
      .patch(`/service-orders/${sid}/sign-in`)
      .send({ lat: 30.2, lng: 120.3 });
    detail = await request(server).get(`/service-orders/${sid}`);
    expect(detail.body.data.status).toBe(ServiceStatus.SIGNED_IN);

    await request(server).patch(`/service-orders/${sid}/start`).send();
    detail = await request(server).get(`/service-orders/${sid}`);
    expect(detail.body.data.status).toBe(ServiceStatus.SERVING);

    await request(server)
      .patch(`/service-orders/${sid}/complete`)
      .send({ description: 'done', images: [] });
    detail = await request(server).get(`/service-orders/${sid}`);
    expect(detail.body.data.status).toBe(ServiceStatus.COMPLETED);
  });

  it('should allow only one feeder to accept an order', async () => {
    const owner = await request(server)
      .post('/users')
      .send({ openid: 'owner3', nickname: 'owner3' });
    const pet = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: owner.body.data.id, name: 'p', species: 'cat' });
    const order = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: owner.body.data.id,
        petId: pet.body.data.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'paid',
      });
    const orderId = order.body.data.id;

    const fu1 = await request(server)
      .post('/users')
      .send({ openid: 'feeder3', nickname: 'f3' });
    const feeder1 = await request(server)
      .post('/feeders')
      .send({ userId: fu1.body.data.id, name: 'f3', phone: '1', idCard: '1' });
    const fu2 = await request(server)
      .post('/users')
      .send({ openid: 'feeder4', nickname: 'f4' });
    const feeder2 = await request(server)
      .post('/feeders')
      .send({ userId: fu2.body.data.id, name: 'f4', phone: '1', idCard: '2' });
    const fid1 = feeder1.body.data.id;
    const fid2 = feeder2.body.data.id;
    await request(server).patch(`/feeders/${fid1}/status/1`).send();
    await request(server).patch(`/feeders/${fid2}/status/1`).send();

    const [res1, res2] = await Promise.all([
      request(server).post('/service-orders').send({ feederId: fid1, orderId }),
      request(server).post('/service-orders').send({ feederId: fid2, orderId }),
    ]);

    const successCount = [res1, res2].filter((r) => r.status === 201).length;
    expect(successCount).toBe(1);
  });

  it('should validate sign-in distance', async () => {
    const uRes = await request(server)
      .post('/users')
      .send({ openid: 'feeder5', nickname: 'f5' });
    const fRes = await request(server)
      .post('/feeders')
      .send({ userId: uRes.body.data.id, name: 'f5', phone: '1', idCard: '3' });
    const feederId = fRes.body.data.id;
    await request(server).patch(`/feeders/${feederId}/status/1`).send();

    const oRes = await request(server)
      .post('/users')
      .send({ openid: 'owner4', nickname: 'o4' });
    const pRes = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: oRes.body.data.id, name: 'p', species: 'cat' });
    const orderRes = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: oRes.body.data.id,
        petId: pRes.body.data.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'paid',
      });
    const orderId = orderRes.body.data.id;
    const sRes = await request(server)
      .post('/service-orders')
      .send({ feederId, orderId });
    const sid = sRes.body.data.id;

    const lat = 30.4;
    const lng = 120.4;
    await request(server)
      .patch(`/service-orders/${sid}/sign-in`)
      .send({ lat, lng });

    const detail = await request(server).get(`/service-orders/${sid}`);
    const d = distance(lat, lng, detail.body.data.signInLat, detail.body.data.signInLng);
    expect(d).toBeLessThan(1000);
  });

  it('should reject order for blacklisted feeder', async () => {
    const uRes = await request(server)
      .post('/users')
      .send({ openid: 'feeder6', nickname: 'f6' });
    const fRes = await request(server)
      .post('/feeders')
      .send({ userId: uRes.body.data.id, name: 'f6', phone: '1', idCard: '4' });
    const feederId = fRes.body.data.id;

    await request(server).patch(`/feeders/${feederId}`).send({ isBlacklist: 1 });

    const owner = await request(server)
      .post('/users')
      .send({ openid: 'owner5', nickname: 'o5' });
    const pet = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: owner.body.data.id, name: 'p', species: 'cat' });
    const order = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: owner.body.data.id,
        petId: pet.body.data.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: 'paid',
      });

    const res = await request(server)
      .post('/service-orders')
      .send({ feederId, orderId: order.body.data.id });
    expect(res.status).toBe(403);
  });
});
