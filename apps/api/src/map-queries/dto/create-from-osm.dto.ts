import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateFromOsmDto {
  @ApiProperty({ enum: ['node', 'way', 'relation'], example: 'node' })
  @IsEnum(['node', 'way', 'relation'])
  type: 'node' | 'way' | 'relation';

  @ApiProperty({ example: 2916296009 })
  @IsNumber()
  id: number;
}
