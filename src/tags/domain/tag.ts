import { Marker } from '../../markers/domain/marker';
import { ApiProperty } from '@nestjs/swagger';

export class Tag {
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
    type: () => String,
    nullable: false,
  })
  value: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  key: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
