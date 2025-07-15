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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    PetsModule,
    OrdersModule,
    FeedersModule,
    ServiceOrdersModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
