import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: +(process.env.MYSQL_PORT || 3306),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DB || 'pet_feeder',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    PetsModule,
    OrdersModule,
    FeedersModule,
    ServiceOrdersModule,
    TrackingModule,
    AuthModule,
    AdminModule,
    EvaluationsModule,
    FeedbackModule,
    ComplaintsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
