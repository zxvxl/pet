import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AdminRole } from '../admin-role.enum';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 32 })
  role: AdminRole;

  @Column('tinyint', { default: 1 })
  status: number;

  @CreateDateColumn()
  createTime: Date;
}
