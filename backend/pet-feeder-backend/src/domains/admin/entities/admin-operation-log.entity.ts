import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdminUser } from './admin-user.entity';

@Entity('admin_operation_log')
export class AdminOperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AdminUser)
  user: AdminUser;

  @Column({ length: 128 })
  action: string;

  @Column('bigint')
  targetId: number;

  @Column({ length: 64 })
  targetType: string;

  @Column('text', { nullable: true })
  detail?: string;

  @CreateDateColumn()
  createTime: Date;
}
