import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';
import { OrderEntity } from './order.entity';

@Entity('reserve_order_items')
export class OrderServiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;

  @ManyToOne(() => ServiceType)
  service: ServiceType;

  @ManyToOne(() => Pet)
  pet: Pet;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 50 })
  serviceName: string;
}
