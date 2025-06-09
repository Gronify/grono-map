import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class CommentWithoutMarkerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => User })
  user: User;
}
