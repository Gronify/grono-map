import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class LlmQueryResultDto {
  @ApiProperty({
    example:
      '[out:json];node["amenity"="cafe"](around:500,50.4501,30.5234);out;',
  })
  @IsString()
  llmResponse: string;

  @ApiProperty({ example: 'gemini-pro' })
  @IsString()
  llmModel: string;

  @ApiProperty({ example: 123 })
  @IsNumber()
  duration: number;

  @ApiProperty({ enum: ['success', 'error'], example: 'success' })
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';
}
