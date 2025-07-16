import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ServiceOrder } from '../../service-orders/entities/service-order.entity';

@Entity('feeder_locations')
export class FeederLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ServiceOrder)
  order: ServiceOrder;

  @Column('decimal', { precision: 9, scale: 6 })
  lat: number;

  @Column('decimal', { precision: 9, scale: 6 })
  lng: number;

  @CreateDateColumn()
  createTime: Date;
}
