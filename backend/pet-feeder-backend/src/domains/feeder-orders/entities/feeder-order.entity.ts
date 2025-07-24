import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Feeder } from '../../feeders/entities/feeder.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Order } from '../../orders/entities/order.entity';
import { FeederOrderStatus } from '../status.enum';

@Entity('feeder_order')
export class FeederOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Feeder)
  feeder: Feeder;

  @ManyToOne(() => Pet)
  pet: Pet;

  @ManyToOne(() => Order)
  base_order: Order;

  @Column({ type: 'datetime', name: 'service_time' })
  service_time: Date;

  @Column({ length: 200, name: 'address' })
  address: string;

  @Column({
    type: 'enum',
    enum: FeederOrderStatus,
    default: FeederOrderStatus.PENDING,
    name: 'status'
  })
  status: FeederOrderStatus;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true, name: 'sign_in_lat' })
  sign_in_lat?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true, name: 'sign_in_lng' })
  sign_in_lng?: number;

  @Column({ type: 'datetime', nullable: true, name: 'sign_in_time' })
  sign_in_time?: Date;

  @Column({ type: 'datetime', nullable: true, name: 'complete_time' })
  complete_time?: Date;

  @Column({ type: 'json', nullable: true, name: 'complete_images' })
  complete_images?: string[];

  @Column({ type: 'text', nullable: true, name: 'description' })
  description?: string;

  @Column({ type: 'json', nullable: true, name: 'images' })
  images?: string[];

  @Column({ type: 'text', nullable: true, name: 'remark' })
  remark?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
