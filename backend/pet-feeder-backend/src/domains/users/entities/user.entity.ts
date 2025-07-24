import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('user_account')
// 👉 模块：用户实体，对应表 user_account
export class User {
  /** 主键 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 微信 openid 唯一 */
  @Column({ unique: true, name: 'open_id' })
  open_id: string;

  /** 微信 unionid，可为空全局唯一 */
  @Column({ unique: true, nullable: true, name: 'union_id' })
  union_id?: string;

  /** 昵称 */
  @Column({ length: 100, name: 'nickname' })
  nickname: string;

  /** 头像地址 */
  @Column({ length: 255, nullable: true, name: 'avatar' })
  avatar?: string;

  /** 角色: user/operator/super */
  @Column({
    type: 'varchar',
    length: 20,
    default: 'user',
    name: 'role'
  })
  role: string;

  /** 手机号 */
  @Column({ length: 20, nullable: true, name: 'phone' })
  phone?: string;

  /** 创建时间 */
  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  /** 更新时间 */
  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  /** 是否删除 */
  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;

  /** 用户拥有的宠物 */
  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  /** 用户创建的订单 */
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
