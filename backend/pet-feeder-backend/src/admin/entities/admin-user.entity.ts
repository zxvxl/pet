import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
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

  /** 关联角色列表 */
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'admin_user_roles',
    joinColumn: { name: 'admin_user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
