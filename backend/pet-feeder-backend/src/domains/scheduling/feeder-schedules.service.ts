import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not, In, Between } from 'typeorm';
import { FeederSchedule } from './entities/feeder-schedule.entity';
import { ScheduleItemDto } from './dto/schedule-item.dto';
import { Feeder } from '../feeders/entities/feeder.entity';
import { FeederOrder } from '../feeder-orders/entities/feeder-order.entity';
import { FeederOrderStatus } from '../feeder-orders/status.enum';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class FeederSchedulesService {
  constructor(
    @InjectRepository(FeederSchedule)
    private repository: Repository<FeederSchedule>,
    @InjectRepository(Feeder)
    private feeders: Repository<Feeder>,
    @InjectRepository(FeederOrder)
    private feederOrders: Repository<FeederOrder>,
  ) {}

  /**
   * Overwrite schedules of given feeder with provided list.
   */
  async saveBatch(feederId: number, items: ScheduleItemDto[]) {
    await this.assertNoConflict(feederId, items);
    await this.repository.delete({ feeder: { id: feederId } });
    const entities = items.map((i) =>
      this.repository.create({
        feeder: { id: feederId } as Feeder,
        weekday: i.weekday,
        startTime: i.startTime,
        endTime: i.endTime,
        enabled: i.enabled ?? 1,
      }),
    );
    return this.repository.save(entities);
  }

  /** Save schedules by user id */
  async saveForUser(userId: number, items: ScheduleItemDto[]) {
    const feederId = await this.findFeederIdByUser(userId);
    if (!feederId) throw new BusinessException(4004, 'FEEDER_NOT_FOUND');
    await this.assertNoConflict(feederId, items);
    return this.saveBatch(feederId, items);
  }

  /** List schedules by user id */
  async listForUser(userId: number) {
    const feederId = await this.findFeederIdByUser(userId);
    if (!feederId) throw new BusinessException(4004, 'FEEDER_NOT_FOUND');
    return this.findByFeeder(feederId);
  }

  /** Find schedules belonging to a feeder. */
  findByFeeder(feederId: number) {
    return this.repository.find({
      where: { feeder: { id: feederId } },
      order: { weekday: 'ASC', startTime: 'ASC' },
    });
  }

  /**
   * Determine if feeder is available for requested time range.
   */
  async isFeederAvailable(
    feederId: number,
    weekday: number,
    start: string,
    end: string,
  ) {
    const list = await this.findByFeeder(feederId);
    return list.some(
      (s) =>
        s.enabled &&
        s.weekday === weekday &&
        s.startTime <= start &&
        s.endTime >= end,
    );
  }

  /** Helper to get feederId via user id. */
  async findFeederIdByUser(userId: number) {
    const feeder = await this.feeders.findOne({ where: { user: { id: userId } } });
    return feeder?.id ?? null;
  }

  /** Validate upcoming orders still fit new schedules */
  private async assertNoConflict(feederId: number, items: ScheduleItemDto[]) {
    const upcoming = await this.feederOrders.find({
      where: {
        feeder: { id: feederId },
        serviceTime: MoreThan(new Date()),
        status: Not(In([FeederOrderStatus.CANCELED, FeederOrderStatus.REJECTED])),
      },
    });
    for (const order of upcoming) {
      const weekday = (order.serviceTime.getDay() + 6) % 7;
      const time = order.serviceTime.toTimeString().slice(0, 8);
      const ok = items.some(
        (i) =>
          i.weekday === weekday && i.startTime <= time && i.endTime >= time,
      );
      if (!ok)
        throw new BusinessException(4005, 'SCHEDULE_CONFLICT_WITH_ORDER');
    }
  }

  /** Find available feeders for time range */
  async findAvailableFeeders(start: Date, end: Date) {
    const weekday = (start.getDay() + 6) % 7;
    const startStr = start.toTimeString().slice(0, 8);
    const endStr = end.toTimeString().slice(0, 8);
    const qb = this.repository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.feeder', 'f')
      .where('s.enabled = 1')
      .andWhere('f.status = 1')
      .andWhere('f.isBlacklist = 0')
      .andWhere('s.weekday = :weekday', { weekday })
      .andWhere('s.startTime <= :start', { start: startStr })
      .andWhere('s.endTime >= :end', { end: endStr });
    const schedules = await qb.getMany();
    if (schedules.length === 0) return [];
    const busy = await this.feederOrders.find({
      where: {
        feeder: In(schedules.map((s) => s.feeder.id)),
        serviceTime: Between(start, end),
        status: Not(In([FeederOrderStatus.CANCELED, FeederOrderStatus.REJECTED])),
      },
      relations: ['feeder'],
    });
    const busyIds = new Set(busy.map((o) => o.feeder.id));
    return schedules
      .map((s) => s.feeder)
      .filter((f) => !busyIds.has(f.id));
  }

  /** Paginate feeders with schedules for admin */
  async paginateAll(page: number, limit: number, name?: string) {
    const qb = this.feeders.createQueryBuilder('f');
    if (name) qb.where('f.name like :n', { n: `%${name}%` });
    qb.skip((page - 1) * limit).take(limit);
    const [feeders, total] = await qb.getManyAndCount();
    const items = [] as any[];
    for (const f of feeders) {
      const schedules = await this.findByFeeder(f.id);
      items.push({ feeder: f, schedules });
    }
    return { items, total, page, limit };
  }
}
