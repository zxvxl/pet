import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';

@Entity('user_order')
// 👉 模块：订单实体，对应表 user_order
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
  @Column({ type: 'datetime', name: 'start_time' })
  start_time: Date;

  /** 结束时间 */
  @Column({ type: 'datetime', name: 'end_time' })
  end_time: Date;

  /** 订单状态，如 pending/paid */
  @Column({ length: 50, default: 'pending', name: 'status' })
  status: string;

  /** 总价 */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, name: 'total_price' })
  total_price: number;

  /** 创建时间 */
  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  /** 更新时间 */
  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  /** 是否删除 */
  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
