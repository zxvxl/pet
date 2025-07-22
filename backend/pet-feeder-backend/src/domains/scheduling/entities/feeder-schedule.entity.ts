import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feeder } from '../../feeders/entities/feeder.entity';

/**
 * FeederSchedule defines availability time ranges for a feeder.
 */
@Entity('feeder_schedules')
export class FeederSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @Column('tinyint')
  weekday: number; // 0~6 representing Monday-Sunday

  @Column({ type: 'varchar', length: 8 })
  startTime: string; // e.g. '09:00:00'

  @Column({ type: 'varchar', length: 8 })
  endTime: string; // e.g. '18:00:00'

  @Column('tinyint', { default: 1 })
  enabled: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
