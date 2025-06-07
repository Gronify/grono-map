import { MarkerEntity } from '../../../../../markers/infrastructure/persistence/relational/entities/marker.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'comment',
})
export class CommentEntity extends EntityRelationalHelper {
  @ManyToOne(() => MarkerEntity, { eager: true, nullable: false })
  marker: MarkerEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @Column({
    nullable: false,
    type: String,
  })
  text: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
