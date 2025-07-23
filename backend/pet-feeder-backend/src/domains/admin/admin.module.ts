import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUserController } from './admin-user.controller';
import { AdminRoleController } from './admin-role.controller';
import { AdminUserService } from './admin-user.service';
import { AdminRoleService } from './admin-role.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminUser } from './entities/admin-user.entity';
import { AdminOperationLog } from './entities/admin-operation-log.entity';
import { AdminRole } from './entities/admin-role.entity';
import { Complaint } from '../complaints/entities/complaint.entity';
import { Feedback } from '../feedback/entities/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feeder,
      Order,
      AdminUser,
      AdminRole,
      AdminOperationLog,
      Complaint,
      Feedback,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [
    AdminController,
    AdminUserController,
    AdminRoleController,
  ],
  providers: [
    AdminService,
    AdminJwtGuard,
    AdminUserService,
    AdminRoleService,
  ],
  exports: [AdminService, AdminJwtGuard, AdminUserService, AdminRoleService],
})
export class AdminModule {}
