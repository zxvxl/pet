import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('user_pet')
// 👉 模块：宠物实体，对应表 user_pet
export class Pet {
  /** 主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 所属用户 */
  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  /** 宠物名称 */
  @Column({ name: 'name' })
  name: string;

  /** 品种 */
  @Column({ length: 50, name: 'species' })
  species: string;

  /** 年龄，可为空 */
  @Column({ type: 'int', nullable: true, name: 'age' })
  age?: number;

  /** 备注 */
  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes?: string;

  /** 当前喂养员，可为空 */
  @ManyToOne(() => Feeder, { nullable: true })
  feeder?: Feeder;

  /** 宠物关联的订单 */
  @OneToMany(() => Order, (order) => order.pet)
  orders: Order[];

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
