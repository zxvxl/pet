import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import wechatConfig from './infrastructure/config/wechat.config';
import databaseConfig from './infrastructure/config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './domains/users/users.module';
import { PetsModule } from './domains/pets/pets.module';
import { OrdersModule } from './domains/orders/orders.module';
import { FeedersModule } from './domains/feeders/feeders.module';
import { AuthModule } from './domains/auth/auth.module';
import { ServiceOrdersModule } from './domains/service-orders/service-orders.module';
import { AdminModule } from './domains/admin/admin.module';
import { TrackingModule } from './domains/tracking/tracking.module';
import { EvaluationsModule } from './domains/evaluations/evaluations.module';
import { FeedbackModule } from './domains/feedback/feedback.module';
import { ComplaintsModule } from './domains/complaints/complaints.module';
import { FeederOrdersModule } from './domains/feeder-orders/feeder-orders.module';
import { FeederSchedulesModule } from './domains/scheduling/feeder-schedules.module';
import { ServiceTypesModule } from './domains/service-types/service-types.module';
import { ReserveOrdersModule } from './domains/reserve-orders/reserve-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Support per-environment, local and example env files
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', '.env.example'],
      load: [wechatConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.name,
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    UsersModule,
    PetsModule,
    OrdersModule,
    FeedersModule,
    ServiceOrdersModule,
    ServiceTypesModule,
    ReserveOrdersModule,
    TrackingModule,
    AuthModule,
    AdminModule,
    EvaluationsModule,
    FeedbackModule,
    ComplaintsModule,
    FeederOrdersModule,
    FeederSchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
