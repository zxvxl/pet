import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
import { ServiceOrder } from '../../service-orders/entities/service-order.entity';

@Entity('track_path')
export class FeederLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceOrder)
  order: ServiceOrder;

  @Column('decimal', { precision: 9, scale: 6, name: 'latitude' })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6, name: 'longitude' })
  longitude: number;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
