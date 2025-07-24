import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { User } from '../../users/entities/user.entity';

@Entity('feeder_info')
export class Feeder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ length: 100, name: 'name' })
  name: string;

  @Column({ length: 20, name: 'phone' })
  phone: string;

  @Column({ length: 18, name: 'id_card' })
  id_card: string;

  @Column({ length: 255, nullable: true, name: 'avatar' })
  avatar?: string;

  @Column('tinyint', { default: 0, name: 'status' })
  status: number;

  @Column({ length: 255, nullable: true, name: 'reject_reason' })
  reject_reason?: string;

  @Column('tinyint', { default: 0, name: 'is_blacklist' })
  is_blacklist: number;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @Column('decimal', { precision: 3, scale: 2, default: 0, name: 'rating' })
  rating: number;

  @OneToMany(() => Order, (order) => order.feeder)
  orders: Order[];

  @OneToMany(() => Pet, (pet) => pet.feeder)
  pets: Pet[];

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
