import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AdminUser } from './admin-user.entity';
import { AdminPermission } from './admin-permission.entity';

@Entity('admin_role')
export class AdminRole {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => AdminUser, (user) => user.roles)
  users: AdminUser[];

  @ManyToMany(() => AdminPermission)
  @JoinTable({
    name: 'admin_role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: AdminPermission[];
}
