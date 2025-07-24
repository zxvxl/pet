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
@Entity('feeder_schedule')
export class FeederSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @Column({ type: 'tinyint', name: 'weekday' })
  weekday: number; // 0~6 representing Monday-Sunday

  @Column({ type: 'varchar', length: 8, name: 'start_time' })
  start_time: string; // e.g. '09:00:00'

  @Column({ type: 'varchar', length: 8, name: 'end_time' })
  end_time: string; // e.g. '18:00:00'

  @Column({ type: 'tinyint', default: 1, name: 'enabled' })
  enabled: number;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
