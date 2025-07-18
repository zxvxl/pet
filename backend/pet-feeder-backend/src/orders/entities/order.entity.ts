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
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.orders)
  pet: Pet;

  @ManyToOne(() => Feeder, { nullable: true })
  feeder?: Feeder;

  @Column('datetime')
  startTime: Date;

  @Column('datetime')
  endTime: Date;

  @Column({ length: 50, default: 'pending' })
  status: string;
}
