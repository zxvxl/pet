import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeederSchedule } from './entities/feeder-schedule.entity';
import { ScheduleItemDto } from './dto/schedule-item.dto';
import { Feeder } from '../feeders/entities/feeder.entity';

@Injectable()
export class FeederSchedulesService {
  constructor(
    @InjectRepository(FeederSchedule)
    private repository: Repository<FeederSchedule>,
    @InjectRepository(Feeder)
    private feeders: Repository<Feeder>,
  ) {}

  /**
   * Overwrite schedules of given feeder with provided list.
   */
  async saveBatch(feederId: number, items: ScheduleItemDto[]) {
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
}
