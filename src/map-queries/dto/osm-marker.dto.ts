export interface OsmElementTags {
  [key: string]: string;
}

export interface OsmElementApi {
  type: 'node' | 'way' | 'relation';
  id: number;
  lon: number;
  lat: number;
  tags: OsmElementTags;
}

export interface OverpassApiResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OsmElementApi[];
}

export interface OsmElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  longitude: number;
  latitude: number;
  tags: OsmElementTags;
}
