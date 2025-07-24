import { Column, Entity, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderServiceItem } from './order-service-item.entity';

@Entity('user_reserve_order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'datetime', name: 'reserve_time' })
  reserve_time: Date;

  @Column({ length: 200, name: 'address' })
  address: string;

  @Column({ type: 'text', nullable: true, name: 'remark' })
  remark?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  total_amount: number;

  @Column({ length: 20, default: 'pending', name: 'status' })
  status: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;

  @OneToMany(() => OrderServiceItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderServiceItem[];
}
