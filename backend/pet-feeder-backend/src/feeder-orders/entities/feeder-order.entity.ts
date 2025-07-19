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

@Entity('feeder_orders')
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
  baseOrder: Order;

  @Column('datetime')
  serviceTime: Date;

  @Column({ length: 200 })
  address: string;

  @Column({
    type: 'enum',
    enum: FeederOrderStatus,
    default: FeederOrderStatus.PENDING,
  })
  status: FeederOrderStatus;

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

  @Column({ type: 'simple-json', nullable: true })
  images?: string[];

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
