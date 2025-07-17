import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Feeder } from '../../feeders/entities/feeder.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('feeder_service_orders')
@Unique(['order'])
export class ServiceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @ManyToOne(() => Order)
  order: Order;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  signInLat?: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  signInLng?: number;

  @Column({ type: 'datetime', nullable: true })
  signInTime?: Date;

  @Column({ type: 'datetime', nullable: true })
  completeTime?: Date;

  @Column({ type: 'simple-json', nullable: true })
  completeImages?: string[];

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('tinyint', { default: 0 })
  status: number;

  @CreateDateColumn()
  createTime: Date;
}
