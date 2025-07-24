import { Injectable, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CompleteServiceDto } from './dto/complete-service.dto';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { ServiceStatus } from './status.enum';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { WxTemplateService } from '../tracking/wx-template.service';
import { createStatusUpdater } from '../../common/utils/update-status.util';

@Injectable()
export class ServiceOrdersService {
  constructor(
    @InjectRepository(ServiceOrder)
    private repository: Repository<ServiceOrder>,
    @InjectRepository(Feeder)
    private feeders: Repository<Feeder>,
    @InjectRepository(Order)
    private orders: Repository<Order>,
    private gateway: TrackingGateway,
    private wxService: WxTemplateService,
  ) {
    const templateMap: Record<ServiceStatus, string> = {
      [ServiceStatus.PENDING]: '',
      [ServiceStatus.ACCEPTED]: 'accept_tpl',
      [ServiceStatus.DEPARTED]: 'depart_tpl',
      [ServiceStatus.SIGNED_IN]: 'signin_tpl',
      [ServiceStatus.SERVING]: 'serving_tpl',
      [ServiceStatus.COMPLETED]: 'complete_tpl',
      [ServiceStatus.CANCELED]: 'cancel_tpl',
      [ServiceStatus.REJECTED]: 'reject_tpl'
    };
    this.updateStatus = createStatusUpdater(
      this.repository,
      this.gateway,
      this.wxService,
      templateMap,
      this.findOne.bind(this),
    );
  }

  public updateStatus: (
    id: number,
    status: ServiceStatus,
    extra?: Record<string, any>,
  ) => Promise<any>;

  async create(dto: CreateServiceOrderDto) {
    const feeder = await this.feeders.findOne({ where: { id: dto.feederId } });
    if (feeder?.is_blacklist) {
      throw new BusinessException(3001, 'BLACKLIST', HttpStatus.FORBIDDEN);
    }
    const existing = await this.repository.findOne({
      where: { base_order: { id: dto.orderId } },
    });
    if (existing) {
      throw new BusinessException(3002, 'ORDER_TAKEN', HttpStatus.CONFLICT);
    }

    const entity = this.repository.create({
      feeder: { id: dto.feederId } as Feeder,
      base_order: { id: dto.orderId } as Order,
      status: ServiceStatus.ACCEPTED,
    });
    try {
      const saved = await this.repository.save(entity);
      this.gateway.notifyStatus(saved.id, ServiceStatus.ACCEPTED);
      return saved;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BusinessException(3002, 'ORDER_TAKEN', HttpStatus.CONFLICT);
      }
      throw err;
    }
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['feeder', 'base_order', 'base_order.user'],
    });
  }

  signIn(id: number, dto: SignInDto) {
    return this.updateStatus(id, ServiceStatus.SIGNED_IN, {
      signInLat: dto.lat,
      signInLng: dto.lng,
      signInTime: new Date(),
    });
  }

  complete(id: number, dto: CompleteServiceDto) {
    return this.updateStatus(id, ServiceStatus.COMPLETED, {
      completeTime: new Date(),
      description: dto.description,
      completeImages: dto.images,
    });
  }

  cancel(id: number) {
    return this.updateStatus(id, ServiceStatus.CANCELED);
  }

}
