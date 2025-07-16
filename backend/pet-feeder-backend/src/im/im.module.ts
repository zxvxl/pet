import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImController } from './im.controller';
import { ImService } from './im.service';
import { Message } from './entities/message.entity';
import { EmergencyCall } from './entities/emergency-call.entity';
import { ImGateway } from './im.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message, EmergencyCall])],
  controllers: [ImController],
  providers: [ImService, ImGateway],
  exports: [ImService],
})
export class ImModule {}
