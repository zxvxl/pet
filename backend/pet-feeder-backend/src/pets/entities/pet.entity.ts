import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('pets')
// 👉 模块：宠物实体，对应表 pets
export class Pet {
  /** 主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 所属用户 */
  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  /** 宠物名称 */
  @Column()
  name: string;

  /** 品种 */
  @Column({ length: 50 })
  species: string;

  /** 年龄，可为空 */
  @Column({ type: 'int', nullable: true })
  age?: number;

  /** 备注 */
  @Column({ type: 'text', nullable: true })
  notes?: string;

  /** 当前喂养员，可为空 */
  @ManyToOne(() => Feeder, { nullable: true })
  feeder?: Feeder;

  /** 宠物关联的订单 */
  @OneToMany(() => Order, (order) => order.pet)
  orders: Order[];
}
