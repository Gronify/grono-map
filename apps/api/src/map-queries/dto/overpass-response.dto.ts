import { ApiProperty } from '@nestjs/swagger';

class OverpassElementTagDto {
  [key: string]: string;
}

export class OverpassElementDto {
  @ApiProperty({ example: 'node' })
  type: 'node' | 'way' | 'relation';

  @ApiProperty({ example: 2916296009 })
  id: number;

  @ApiProperty({ example: 49.7933801 })
  lat?: number;

  @ApiProperty({ example: 30.1127954 })
  lon?: number;

  @ApiProperty({
    type: 'object',
    example: {
      amenity: 'bar',
      name: 'Yoko sushi',
      cuisine: 'japanese',
    },
    additionalProperties: { type: 'string' },
  })
  tags: OverpassElementTagDto;
}

export class OverpassMetaDto {
  @ApiProperty({ example: '2025-06-13T01:05:06Z' })
  timestamp_osm_base: string;

  @ApiProperty({
    example:
      'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
  })
  copyright: string;
}

export class OverpassResponseDto {
  @ApiProperty({ example: 0.6 })
  version: number;

  @ApiProperty({ example: 'Overpass API 0.7.62.7 375dc00a' })
  generator: string;

  @ApiProperty({ type: OverpassMetaDto })
  osm3s: OverpassMetaDto;

  @ApiProperty({ type: [OverpassElementDto] })
  elements: OverpassElementDto[];
}
