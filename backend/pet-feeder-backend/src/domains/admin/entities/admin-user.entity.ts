import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminRole } from './admin-role.entity';

@Entity('admin_user')
export class AdminUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, name: 'username' })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'salt' })
  salt?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'nickname' })
  nickname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'email' })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone' })
  phone?: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: () => '1',
    nullable: false,
    name: 'is_active',
  })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToMany(() => AdminRole, (role) => role.users)
  @JoinTable({
    name: 'admin_user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: AdminRole[];
}
