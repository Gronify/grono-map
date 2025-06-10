import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class MapQuery {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  radius?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  longitude?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  latitude?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  inputText?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  llmResponse?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  llmModel?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  status?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  duration?: number | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  user?: User | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
