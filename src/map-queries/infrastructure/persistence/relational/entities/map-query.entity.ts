import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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
  name: 'map_query',
})
export class MapQueryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    type: Number,
  })
  radius?: number | null;

  @Column({
    nullable: true,
    type: 'double precision',
  })
  longitude?: number | null;

  @Column({
    nullable: true,
    type: 'double precision',
  })
  latitude?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  inputText?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  llmResponse?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  llmModel?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  status?: string | null;

  @Column({
    nullable: true,
    type: Number,
  })
  duration?: number | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  user?: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
