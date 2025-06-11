import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQueryDto {
  @ApiProperty({ example: 'Find all pharmacies' })
  @IsString()
  input: string;

  @ApiProperty({ example: 49.798047 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 30.114261 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  radius: number;
}
