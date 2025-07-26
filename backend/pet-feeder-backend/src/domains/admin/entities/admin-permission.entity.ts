import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_permission')
export class AdminPermission {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true, name: 'code' })
  code: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'type' })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'description' })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
