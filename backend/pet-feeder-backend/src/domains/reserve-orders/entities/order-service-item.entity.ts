import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { ServiceType } from '../../service-types/entities/service-type.entity';
import { OrderEntity } from './order.entity';

@Entity('user_reserve_order_item')
export class OrderServiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;

  @ManyToOne(() => ServiceType)
  service: ServiceType;

  @ManyToOne(() => Pet)
  pet: Pet;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  price: number;

  @Column({ length: 50, name: 'service_name' })
  service_name: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
