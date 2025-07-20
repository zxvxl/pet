import { Injectable, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../common/exceptions/business.exception';
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
  ) {}

  async create(dto: CreateServiceOrderDto) {
    const feeder = await this.feeders.findOne({ where: { id: dto.feederId } });
    if (feeder?.isBlacklist) {
      throw new BusinessException(3001, 'BLACKLIST', HttpStatus.FORBIDDEN);
    }
    const existing = await this.repository.findOne({
      where: { baseOrder: { id: dto.orderId } },
    });
    if (existing) {
      throw new BusinessException(3002, 'ORDER_TAKEN', HttpStatus.CONFLICT);
    }

    const entity = this.repository.create({
      feeder: { id: dto.feederId } as Feeder,
      baseOrder: { id: dto.orderId } as Order,
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
      relations: ['feeder', 'baseOrder', 'baseOrder.user'],
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

  async updateStatus(
    id: number,
    status: ServiceStatus,
    extra: Record<string, any> = {},
  ) {
    this.gateway.notifyStatus(id, status);
    const res = await this.repository.update(id, { status, ...extra });
    // trigger wx template message
    const templateMap: Partial<Record<ServiceStatus, string>> = {
      [ServiceStatus.ACCEPTED]: 'accept_tpl',
      [ServiceStatus.DEPARTED]: 'depart_tpl',
      [ServiceStatus.SIGNED_IN]: 'signin_tpl',
      [ServiceStatus.SERVING]: 'serving_tpl',
      [ServiceStatus.COMPLETED]: 'complete_tpl',
      [ServiceStatus.CANCELED]: 'cancel_tpl',
    };
    const tpl = templateMap[status];
    if (tpl) {
      const detail = await this.findOne(id);
      const openid = detail?.baseOrder?.user?.openid;
      if (openid) {
        this.wxService.send(openid, tpl, { status }, `/pages/orders/detail?id=${detail!.baseOrder.id}`);
      }
    }
    return res;
  }
}
