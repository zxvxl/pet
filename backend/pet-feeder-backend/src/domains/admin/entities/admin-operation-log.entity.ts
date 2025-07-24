import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AdminUser } from './admin-user.entity';

@Entity('admin_operation_log')
export class AdminOperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AdminUser)
  user: AdminUser;

  @Column({ length: 128, name: 'action' })
  action: string;

  @Column({ type: 'bigint', name: 'target_id' })
  target_id: number;

  @Column({ length: 64, name: 'target_type' })
  target_type: string;

  @Column({ type: 'text', nullable: true, name: 'detail' })
  detail?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
