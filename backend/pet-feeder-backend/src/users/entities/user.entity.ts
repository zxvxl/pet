import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
// 👉 模块：用户实体，对应表 users
export class User {
  /** 主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 微信 openid 唯一 */
  @Column({ unique: true })
  openid: string;

  /** 昵称 */
  @Column({ length: 100 })
  nickname: string;

  /** 头像地址 */
  @Column({ length: 255, nullable: true })
  avatar?: string;

  /** 角色: user/operator/super */
  @Column({
    type: 'varchar',
    length: 20,
    default: 'user',
  })
  role: string;

  /** 手机号 */
  @Column({ length: 20, nullable: true })
  phone?: string;

  /** 用户拥有的宠物 */
  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  /** 用户创建的订单 */
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
