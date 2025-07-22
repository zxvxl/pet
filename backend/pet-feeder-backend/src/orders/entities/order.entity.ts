import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';

@Entity('orders')
// 👉 模块：订单实体，对应表 orders
export class Order {
  /** 订单主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 下单用户 */
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  /** 宠物信息 */
  @ManyToOne(() => Pet, (pet) => pet.orders)
  pet: Pet;

  /** 分配的喂养员，可为空 */
  @ManyToOne(() => Feeder, { nullable: true })
  feeder?: Feeder;

  /** 开始时间 */
  @Column('datetime')
  startTime: Date;

  /** 结束时间 */
  @Column('datetime')
  endTime: Date;

  /** 订单状态，如 pending/paid */
  @Column({ length: 50, default: 'pending' })
  status: string;
}
