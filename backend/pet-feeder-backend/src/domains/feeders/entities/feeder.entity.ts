// backend/pet-feeder-backend/src/domains/feeders/entities/feeder.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { FeederServiceRecord } from './feeder-service-record.entity';
import { FeederCheckin } from './feeder-checkin.entity';

@Entity('feeders')
@Index('idx_user_id', ['user_id'])
@Index('idx_phone', ['phone'])
@Index('idx_status', ['status'])
@Index('idx_created_at', ['created_at'])
export class Feeder {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true, comment: '关联用户ID' })
  user_id?: number;

  @Column({ type: 'varchar', length: 50, comment: '喂养员姓名' })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 18, nullable: true, comment: '身份证号' })
  id_card?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像URL' })
  avatar?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '地址' })
  address?: string;

  @Column({ type: 'text', nullable: true, comment: '个人简介' })
  bio?: string;

  @Column({ type: 'text', nullable: true, comment: '工作经验' })
  experience?: string;

  @Column({ type: 'json', nullable: true, comment: '资质证书' })
  certificates?: string[];

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '状态：0-待审核，1-已通过，2-已拒绝，3-已禁用',
  })
  status: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 5.0,
    comment: '评分',
  })
  rating: number;

  @Column({ type: 'int', default: 0, comment: '完成订单数' })
  order_count: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '拒绝原因',
  })
  rejection_reason?: string;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '最后登录时间',
  })
  last_login_at?: Date;

  @Column({ type: 'tinyint', default: 1, comment: '是否激活' })
  is_active: boolean;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
  })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, comment: '是否删除' })
  is_deleted: boolean;

  // 关联关系
  @OneToMany(() => FeederServiceRecord, (record) => record.feeder)
  serviceRecords: FeederServiceRecord[];

  @OneToMany(() => FeederCheckin, (checkin) => checkin.feeder)
  checkins: FeederCheckin[];
}