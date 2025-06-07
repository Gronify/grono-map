import { MarkerDto } from '../../markers/dto/marker.dto';

import { UserDto } from '../../users/dto/user.dto';

import { IsString, ValidateNested, IsNotEmptyObject } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateCommentDto {
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
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  text: string;
}
