import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';

@Entity('review_evaluation')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @Column({ length: 10, name: 'role' })
  role: 'user' | 'feeder';

  @Column({ type: 'tinyint', name: 'star' })
  star: number;

  @Column({ type: 'json', nullable: true, name: 'tags' })
  tags?: string[];

  @Column({ type: 'text', nullable: true, name: 'content' })
  content?: string;

  @Column({ type: 'json', nullable: true, name: 'images' })
  images?: string[];

  @Column({ type: 'tinyint', default: 0, name: 'anonymous' })
  anonymous: boolean;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
