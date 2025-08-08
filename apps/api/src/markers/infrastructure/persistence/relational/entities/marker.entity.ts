import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'marker',
})
export class MarkerEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'double precision',
  })
  longitude: number;

  @Column({
    nullable: false,
    type: 'double precision',
  })
  latitude: number;

  @Column({
    nullable: false,
    type: String,
  })
  source: string;

  @Column({
    nullable: false,
    type: String,
  })
  osmType: string;

  @Column({
    nullable: true,
    type: String,
  })
  osmId?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  category: string;

  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
