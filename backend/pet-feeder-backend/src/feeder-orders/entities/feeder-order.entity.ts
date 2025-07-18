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

export enum FeederOrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  SERVING = 'serving',
  COMPLETED = 'completed',
}

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

  @Column({ type: 'simple-json', nullable: true })
  images?: string[];

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
