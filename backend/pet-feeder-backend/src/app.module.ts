import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import wechatConfig from './config/wechat.config';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { OrdersModule } from './orders/orders.module';
import { FeedersModule } from './feeders/feeders.module';
import { AuthModule } from './auth/auth.module';
import { ServiceOrdersModule } from './service-orders/service-orders.module';
import { AdminModule } from './admin/admin.module';
import { TrackingModule } from './tracking/tracking.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { FeederOrdersModule } from './feeder-orders/feeder-orders.module';
import { FeederSchedulesModule } from './feeder-schedules/feeder-schedules.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { ReserveOrdersModule } from './reserve-orders/reserve-orders.module';

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
