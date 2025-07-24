import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { FeederOrder } from './entities/feeder-order.entity';
import { FeederOrderStatus } from './status.enum';
import { CreateFeederOrderDto } from './dto/create-feeder-order.dto';
import { CompleteFeederOrderDto } from './dto/complete-feeder-order.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Order } from '../orders/entities/order.entity';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { WxTemplateService } from '../tracking/wx-template.service';
import { BusinessException } from '../../common/exceptions/business.exception';
import { createStatusUpdater } from '../../common/utils/update-status.util';

@Injectable()
export class FeederOrdersService {
  constructor(
    @InjectRepository(FeederOrder)
    private orders: Repository<FeederOrder>,
    @InjectRepository(Feeder)
    private feeders: Repository<Feeder>,
    private gateway: TrackingGateway,
    private wxService: WxTemplateService,
  ) {
    const templateMap: Record<FeederOrderStatus, string> = {
      [FeederOrderStatus.ACCEPTED]: 'accept_tpl',
      [FeederOrderStatus.DEPARTED]: 'depart_tpl',
      [FeederOrderStatus.SIGNED_IN]: 'signin_tpl',
      [FeederOrderStatus.SERVING]: 'serving_tpl',
      [FeederOrderStatus.COMPLETED]: 'complete_tpl',
      [FeederOrderStatus.CANCELED]: 'cancel_tpl',
      [FeederOrderStatus.REJECTED]: 'reject_tpl',
      [FeederOrderStatus.PENDING]: 'pending_tpl',
    };
    this.updateStatus = createStatusUpdater(
      this.orders,
      this.gateway,
      this.wxService,
      templateMap,
      this.get.bind(this),
    );
  }

  private updateStatus: (
    id: number,
    status: FeederOrderStatus,
    extra?: Record<string, any>,
  ) => Promise<any>;

  async create(dto: CreateFeederOrderDto) {
    const feeder = await this.feeders.findOne({ where: { id: dto.feederId } });
    if (feeder?.is_blacklist) {
      throw new BusinessException(3001, 'BLACKLIST', HttpStatus.FORBIDDEN);
    }
    const existing = await this.orders.findOne({
        where: { base_order: { id: dto.orderId } },
      });
    if (existing) {
      throw new BusinessException(3002, 'ORDER_TAKEN', HttpStatus.CONFLICT);
    }

    const entity = this.orders.create({
      user: { id: dto.userId } as User,
      feeder: { id: dto.feederId } as Feeder,
      pet: { id: dto.petId } as Pet,
      service_time: dto.serviceTime,
      address: dto.address,
      base_order: { id: dto.orderId } as Order,
      status: FeederOrderStatus.ACCEPTED,
    });
    try {
      const saved = await this.orders.save(entity);
      this.gateway.notifyStatus(saved.id, FeederOrderStatus.ACCEPTED);
      return saved;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new BusinessException(3002, 'ORDER_TAKEN', HttpStatus.CONFLICT);
      }
      throw err;
    }
  }

  async paginateByFeeder(feederId: number, page: number, limit: number) {
    const [items, total] = await this.orders.findAndCount({
      where: { feeder: { id: feederId } },
      relations: ['user', 'pet', 'feeder'],
      order: { create_time: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  private async get(id: number) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }


  confirm(id: number) {
    return this.updateStatus(id, FeederOrderStatus.ACCEPTED);
  }

  reject(id: number) {
    return this.updateStatus(id, FeederOrderStatus.REJECTED);
  }

  depart(id: number) {
    return this.updateStatus(id, FeederOrderStatus.DEPARTED);
  }

  signIn(id: number, dto: SignInDto) {
    return this.updateStatus(id, FeederOrderStatus.SIGNED_IN, {
      signInLat: dto.lat,
      signInLng: dto.lng,
      signInTime: new Date(),
    });
  }

  start(id: number) {
    return this.updateStatus(id, FeederOrderStatus.SERVING);
  }

  complete(id: number, dto: CompleteFeederOrderDto) {
    return this.updateStatus(id, FeederOrderStatus.COMPLETED, {
      completeTime: new Date(),
      description: dto.remark,
      completeImages: dto.images,
    });
  }

  cancel(id: number) {
    return this.updateStatus(id, FeederOrderStatus.CANCELED);
  }
}
