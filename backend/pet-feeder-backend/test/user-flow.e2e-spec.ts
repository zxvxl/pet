import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
import { WxTemplateService } from '../src/tracking/wx-template.service';
import { ServiceStatus } from '../src/service-orders/status.enum';

/**
 * Helper to bootstrap application with in-memory sqlite database.
 */
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

/**
 * Validate basic structure and types of response data.
 */
function expectPetShape(pet: any) {
  expect(pet).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      species: expect.any(String),
    }),
  );
}

function expectOrderShape(order: any) {
  expect(order).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      startTime: expect.any(String),
      endTime: expect.any(String),
      status: expect.any(String),
    }),
  );
}

/**
 * End-to-end user flow tests.
 */
describe('User core flow (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;
  let petId: number;
  let orderId: number;
  let serviceOrderId: number;
  let wxService: WxTemplateService;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    wxService = app.get(WxTemplateService);
    jest.spyOn(wxService, 'send').mockResolvedValue(undefined);

    // login to obtain JWT
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ openid: 'user_openid', nickname: 'TestUser' });
    token = loginRes.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should complete add pet -> reserve -> pay -> service flow', async () => {
    // create pet
    const petRes = await request(server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 1, name: 'Kitty', species: 'cat', age: 1 });
    expect(petRes.status).toBe(201);
    expectPetShape(petRes.body.data);
    petId = petRes.body.data.id;

    // create order
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const orderRes = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 1, petId, startTime: start, endTime: end, status: 'reserved' });
    expect(orderRes.status).toBe(201);
    expectOrderShape(orderRes.body.data);
    expect(orderRes.body.data.status).toBe('reserved');
    orderId = orderRes.body.data.id;

    // simulate payment by updating status
    const payRes = await request(server)
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paid' });
    expect(payRes.status).toBe(200);

    // create feeder and service order
    const uRes = await request(server)
      .post('/users')
      .send({ openid: 'feeder_openid', nickname: 'Feeder' });
    const feederRes = await request(server)
      .post('/feeders')
      .send({
        userId: uRes.body.data.id,
        name: 'Feeder',
        phone: '13900000000',
        idCard: '110101199001010000',
      });
    const feederId = feederRes.body.data.id;

    const serviceRes = await request(server)
      .post('/service-orders')
      .send({ feederId, orderId });
    serviceOrderId = serviceRes.body.data.id;
    expect(serviceRes.body.data.status).toBe(ServiceStatus.ACCEPTED);

    // depart
    await request(server).patch(`/service-orders/${serviceOrderId}/depart`).send();
    let detail = await request(server).get(`/service-orders/${serviceOrderId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.DEPARTED);

    // sign in
    await request(server)
      .patch(`/service-orders/${serviceOrderId}/sign-in`)
      .send({ lat: 30.1, lng: 120.2 });
    detail = await request(server).get(`/service-orders/${serviceOrderId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.SIGNED_IN);

    // start service
    await request(server).patch(`/service-orders/${serviceOrderId}/start`).send();
    detail = await request(server).get(`/service-orders/${serviceOrderId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.SERVING);

    // complete service
    await request(server)
      .patch(`/service-orders/${serviceOrderId}/complete`)
      .send({ description: 'done', images: [] });
    detail = await request(server).get(`/service-orders/${serviceOrderId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.COMPLETED);
    expect(wxService.send).toHaveBeenCalled();
  });

  it('should reject unauthorized pet creation', async () => {
    await request(server)
      .post('/pets')
      .send({ userId: 1, name: 'Bad', species: 'cat' })
      .expect(401);
  });

  it('should cancel service order', async () => {
    const cancelRes = await request(server)
      .patch(`/service-orders/${serviceOrderId}/cancel`)
      .send();
    expect(cancelRes.status).toBe(200);
    const detail = await request(server).get(`/service-orders/${serviceOrderId}`);
    expect(detail.body.data.status).toBe(ServiceStatus.CANCELED);
  });
});
