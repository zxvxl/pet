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
import { AdminUser } from '../../admin/entities/admin-user.entity';

@Entity('review_complaint')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  related_order: Order;

  @ManyToOne(() => User)
  user: User;

  @Column({ length: 50, name: 'complaint_type' })
  complaint_type: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'json', nullable: true, name: 'images' })
  images?: string[];

  @Column({ length: 20, default: '待审核', name: 'status' })
  status: string;

  @ManyToOne(() => AdminUser, { nullable: true })
  handled_by?: AdminUser;

  @Column({ type: 'datetime', nullable: true, name: 'handled_at' })
  handled_at?: Date;

  @Column({ type: 'text', nullable: true, name: 'result' })
  result?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
