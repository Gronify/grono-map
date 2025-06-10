import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MapQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
