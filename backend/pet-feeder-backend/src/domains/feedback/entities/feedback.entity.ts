import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  user: User;

  @Column('simple-json')
  type: string[];

  @Column('text')
  description: string;

  @Column('simple-json', { nullable: true })
  images?: string[];

  @Column({ length: 50, nullable: true })
  contact?: string;

  @CreateDateColumn()
  createTime: Date;
}
