import { apiPost } from '@/shared/api/client';

export interface OverpassQueryDto {
  input: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export type OsmElementTags = {
  [key: string]: string;
};
export type OsmElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  longitude: number;
  latitude: number;
  nodes?: number[];
  tags: OsmElementTags;
};

export type OverpassApiMapResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OsmElement[];
};

export async function generateAndFetchOverpassQuery(
  payload: OverpassQueryDto,
): Promise<OverpassApiMapResponse> {
  return apiPost<OverpassApiMapResponse>(
    'map-queries/ai/generate-and-fetch-overpass-query',
    payload,
  );
}
