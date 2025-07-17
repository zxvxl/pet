import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { AdminUser } from '../../admin/entities/admin-user.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  relatedOrder: Order;

  @ManyToOne(() => User)
  user: User;

  @Column({ length: 50 })
  complaintType: string;

  @Column('text')
  description: string;

  @Column('simple-json', { nullable: true })
  images?: string[];

  @Column({ length: 20, default: '待审核' })
  status: string;

  @ManyToOne(() => AdminUser, { nullable: true })
  handledBy?: AdminUser;

  @Column({ type: 'datetime', nullable: true })
  handledAt?: Date;

  @Column('text', { nullable: true })
  result?: string;

  @CreateDateColumn()
  createTime: Date;
}
