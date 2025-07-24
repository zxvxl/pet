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

  @Column({ type: 'int', default: 0 })
  parentId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  path: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  component: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'tinyint', default: 1 })
  isShow: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  permissionCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => AdminRole, (role) => role.menus)
  roles: AdminRole[];
}