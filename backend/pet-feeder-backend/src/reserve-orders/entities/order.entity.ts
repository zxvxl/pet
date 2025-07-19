import { Column, Entity, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderServiceItem } from './order-service-item.entity';

@Entity('reserve_orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column('datetime')
  reserveTime: Date;

  @Column({ length: 200 })
  address: string;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @OneToMany(() => OrderServiceItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderServiceItem[];
}
