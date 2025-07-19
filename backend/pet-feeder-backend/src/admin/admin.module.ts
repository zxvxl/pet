import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUser } from './entities/admin-user.entity';
import { AdminOperationLog } from './entities/admin-operation-log.entity';
import { Complaint } from '../complaints/entities/complaint.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { loadConfig } from '../infrastructure/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feeder,
      Order,
      AdminUser,
      AdminOperationLog,
      Complaint,
      Feedback,
    ]),
    JwtModule.register({
      secret: loadConfig().jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
