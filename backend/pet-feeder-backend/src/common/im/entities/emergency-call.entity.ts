import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('emergency_calls')
export class EmergencyCall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  orderId?: number;

  @CreateDateColumn()
  createTime: Date;

  @Column({ length: 20, nullable: true })
  phone?: string;
}
