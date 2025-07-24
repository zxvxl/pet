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
import { AdminMenu } from './admin-menu.entity';

@Entity('admin_role')
export class AdminRole {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, name: 'code' })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'description' })
  description?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;

  @ManyToMany(() => AdminUser, (user) => user.roles)
  users: AdminUser[];

  @ManyToMany(() => AdminPermission)
  @JoinTable({
    name: 'admin_role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: AdminPermission[];

  @ManyToMany(() => AdminMenu)
  @JoinTable({
    name: 'admin_role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: AdminMenu[];
}
