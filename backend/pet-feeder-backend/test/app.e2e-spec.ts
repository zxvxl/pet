import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { PetsModule } from '../src/pets/pets.module';
import { OrdersModule } from '../src/orders/orders.module';
import { FeedersModule } from '../src/feeders/feeders.module';
import { ServiceOrdersModule } from '../src/service-orders/service-orders.module';
import { TrackingModule } from '../src/tracking/tracking.module';
import { AuthModule } from '../src/auth/auth.module';
import { AdminModule } from '../src/admin/admin.module';
import { User } from '../src/users/entities/user.entity';
import { Pet } from '../src/pets/entities/pet.entity';
import { Order } from '../src/orders/entities/order.entity';
import { Feeder } from '../src/feeders/entities/feeder.entity';
import { ServiceOrder } from '../src/service-orders/entities/service-order.entity';
import { FeederLocation } from '../src/tracking/entities/feeder-location.entity';
import { EmergencyCall } from '../src/im/entities/emergency-call.entity';
import { AdminUser } from '../src/admin/entities/admin-user.entity';
import { AdminOperationLog } from '../src/admin/entities/admin-operation-log.entity';
import { AdminRole } from '../src/admin/entities/admin-role.entity';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
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
            AdminRole,
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
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new (require('../src/common/interceptors/logging.interceptor').LoggingInterceptor)(),
      new (require('../src/common/interceptors/response.interceptor').ResponseInterceptor)(),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ code: 0, message: 'success', data: 'Hello World!' });
  });
});
