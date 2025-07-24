import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('service_type')
export class ServiceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, name: 'name' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'member_price' })
  member_price: number;

  @Column({ length: 255, nullable: true, name: 'description' })
  description?: string;

  @Column({ name: 'supported_species', length: 50, nullable: true })
  supported_species?: string;

  @Column({ name: 'cover_url', length: 255, nullable: true })
  cover_url?: string;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time' })
  update_time: Date;

  @Column({ type: 'tinyint', default: 0, name: 'is_deleted' })
  is_deleted: boolean;
}
