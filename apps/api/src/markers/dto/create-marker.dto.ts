import { IsNumber, IsString, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMarkerDto {
  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  source: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  osmType: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  osmId?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;
}
