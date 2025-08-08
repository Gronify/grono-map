import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MarkerDto {
  @ApiProperty({
    type: String,
    example: 'markerId',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
