import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
