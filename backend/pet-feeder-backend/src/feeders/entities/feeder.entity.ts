import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { User } from '../../users/entities/user.entity';

@Entity('feeders')
export class Feeder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 18 })
  idCard: string;

  @Column({ length: 255, nullable: true })
  avatar?: string;

  @Column('tinyint', { default: 0 })
  status: number;

  @Column({ length: 255, nullable: true })
  rejectReason?: string;

  @Column('tinyint', { default: 0 })
  isBlacklist: number;

  @CreateDateColumn()
  createTime: Date;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @OneToMany(() => Order, (order) => order.feeder)
  orders: Order[];

  @OneToMany(() => Pet, (pet) => pet.feeder)
  pets: Pet[];
}
