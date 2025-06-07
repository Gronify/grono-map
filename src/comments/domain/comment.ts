import { Marker } from '../../markers/domain/marker';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => Marker,
    nullable: false,
  })
  marker: Marker;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
