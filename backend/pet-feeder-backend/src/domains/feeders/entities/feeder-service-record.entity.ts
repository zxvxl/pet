
// backend/pet-feeder-backend/src/domains/feeders/entities/feeder-service-record.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Feeder } from './feeder.entity';

@Entity('feeder_service_records')
@Index('idx_feeder_id', ['feeder_id'])
@Index('idx_order_id', ['order_id'])
@Index('idx_status', ['status'])
@Index('idx_start_time', ['start_time'])
export class FeederServiceRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', comment: '喂养员ID' })
  feeder_id: number;

  @Column({ type: 'bigint', comment: '订单ID' })
  order_id: number;

  @Column({ type: 'varchar', length: 50, comment: '服务类型' })
  service_type: string;

  @Column({ type: 'datetime', comment: '服务开始时间' })
  start_time: Date;

  @Column({ type: 'datetime', nullable: true, comment: '服务结束时间' })
  end_time?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '服务地点' })
  location?: string;

  @Column({ type: 'json', nullable: true, comment: '服务照片' })
  photos?: string[];

  @Column({ type: 'text', nullable: true, comment: '服务备注' })
  notes?: string;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    comment: '服务评分',
  })
  rating?: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
    comment: '状态：pending-待服务，in_progress-服务中，completed-已完成，cancelled-已取消',
  })
  status: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // 关联关系
  @ManyToOne(() => Feeder, (feeder) => feeder.serviceRecords)
  @JoinColumn({ name: 'feeder_id' })
  feeder: Feeder;
}