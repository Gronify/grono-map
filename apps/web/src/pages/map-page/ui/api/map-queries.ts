import { apiPost } from '@/shared/api/client';

export interface OverpassQueryDto {
  input: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export async function generateAndFetchOverpassQuery<T = any>(
  payload: OverpassQueryDto,
): Promise<T> {
  return apiPost<T>(
    'map-queries/ai/generate-and-fetch-overpass-query',
    payload,
  );
}
