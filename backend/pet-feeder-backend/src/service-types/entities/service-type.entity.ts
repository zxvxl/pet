import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'member_price' })
  memberPrice: number;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ name: 'supported_species', length: 50, nullable: true })
  supportedSpecies?: string;

  @Column({ name: 'cover_url', length: 255, nullable: true })
  coverUrl?: string;
}
