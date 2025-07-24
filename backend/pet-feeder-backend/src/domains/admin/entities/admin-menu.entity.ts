import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { AdminRole } from './admin-role.entity';

@Entity('admin_menu')
export class AdminMenu {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', default: 0, name: 'parent_id' })
  parent_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'path' })
  path: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'component' })
  component: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'icon' })
  icon: string;

  @Column({ type: 'int', default: 0, name: 'sort' })
  sort: number;

  @Column({ type: 'tinyint', default: 1, name: 'is_show' })
  is_show: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'permission_code' })
  permission_code: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToMany(() => AdminRole, (role) => role.menus)
  roles: AdminRole[];
}