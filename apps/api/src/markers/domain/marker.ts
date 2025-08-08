import { ApiProperty } from '@nestjs/swagger';

export class Marker {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  osmType: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  osmId?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  source: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  category: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  longitude: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  latitude: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
