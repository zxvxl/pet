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

@Entity('review_feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'json', name: 'type' })
  type: string[];

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'json', nullable: true, name: 'images' })
  images?: string[];

  @Column({ length: 50, nullable: true, name: 'contact' })
  contact?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
