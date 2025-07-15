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
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  @Column()
  name: string;

  @Column({ length: 50 })
  species: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Feeder, { nullable: true })
  feeder?: Feeder;

  @OneToMany(() => Order, (order) => order.pet)
  orders: Order[];
}
