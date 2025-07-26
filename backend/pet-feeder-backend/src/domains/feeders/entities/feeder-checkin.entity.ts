// backend/pet-feeder-backend/src/domains/feeders/entities/feeder-checkin.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Feeder } from './feeder.entity';

@Entity('feeder_checkins')
@Index('idx_feeder_id', ['feeder_id'])
@Index('idx_order_id', ['order_id'])
@Index('idx_checkin_time', ['checkin_time'])
export class FeederCheckin {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', comment: '喂养员ID' })
  feeder_id: number;

  @Column({ type: 'bigint', comment: '订单ID' })
  order_id: number;

  @Column({ type: 'datetime', comment: '签到时间' })
  checkin_time: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '签到位置' })
  location?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
    comment: '纬度',
  })
  latitude?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
    comment: '经度',
  })
  longitude?: number;

  @Column({ type: 'json', nullable: true, comment: '签到照片' })
  photos?: string[];

  @Column({ type: 'text', nullable: true, comment: '签到备注' })
  notes?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  // 关联关系
  @ManyToOne(() => Feeder, (feeder) => feeder.checkins)
  @JoinColumn({ name: 'feeder_id' })
  feeder: Feeder;
}