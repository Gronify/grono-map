import { MarkerEntity } from '../../../../../markers/infrastructure/persistence/relational/entities/marker.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'tag',
})
export class TagEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MarkerEntity, { eager: true, nullable: false })
  marker: MarkerEntity;

  @Column({
    nullable: false,
    type: String,
  })
  value: string;

  @Column({
    nullable: false,
    type: String,
  })
  key: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
