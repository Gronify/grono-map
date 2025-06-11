import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MapQueryConfig } from './map-query.type';

class EnvironmentVariablesValidator {
  @IsString()
  AI_API_KEY: string;

  @IsString()
  AI_MODEL_NAME: string;

  @IsOptional()
  @IsNumber()
  AI_TEMPERATURE?: number;
}

export default registerAs<MapQueryConfig>('mapQuery', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL_NAME
      ? process.env.AI_MODEL_NAME
      : 'gemini-2.0-flash-lite',
    temperature: process.env.AI_TEMPERATURE
      ? parseFloat(process.env.AI_TEMPERATURE)
      : 0.1,
  };
});
