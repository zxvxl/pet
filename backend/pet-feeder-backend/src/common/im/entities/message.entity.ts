import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { MessageType } from '../message-type.enum';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column({ nullable: true })
  orderId?: number;

  @Column('json')
  payload: Record<string, any>;

  @Column('bigint')
  timestamp: number;

  @Column({ default: 0 })
  status: number;
}
