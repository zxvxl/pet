import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Pet } from '../../pets/entities/pet.entity';

@Entity('feeders')
export class Feeder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @OneToMany(() => Order, (order) => order.feeder)
  orders: Order[];

  @OneToMany(() => Pet, (pet) => pet.feeder)
  pets: Pet[];
}
