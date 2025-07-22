import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @Column({ length: 10 })
  role: 'user' | 'feeder';

  @Column('tinyint')
  star: number;

  @Column('simple-json', { nullable: true })
  tags?: string[];

  @Column('text', { nullable: true })
  content?: string;

  @Column('simple-json', { nullable: true })
  images?: string[];

  @Column('tinyint', { default: 0 })
  anonymous: boolean;

  @CreateDateColumn()
  createTime: Date;
}
