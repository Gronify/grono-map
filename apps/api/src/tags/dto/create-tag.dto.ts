import { MarkerDto } from '../../markers/dto/marker.dto';

import { Type } from 'class-transformer';

import { ValidateNested, IsNotEmptyObject, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    required: true,
    type: () => MarkerDto,
  })
  @ValidateNested()
  @Type(() => MarkerDto)
  @IsNotEmptyObject()
  marker: MarkerDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  value: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  key: string;
}
