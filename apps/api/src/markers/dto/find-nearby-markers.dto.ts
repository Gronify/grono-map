import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNearbyMarkersDto {
  @ApiProperty({
    example: 49.798047,
    description: 'Latitude of the center point',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    example: 30.114261,
    description: 'Longitude of the center point',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 1000, description: 'Search radius in meters' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50000)
  radiusMeters: number;
}
