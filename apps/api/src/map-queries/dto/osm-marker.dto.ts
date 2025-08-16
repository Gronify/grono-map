export interface OsmElementTags {
  [key: string]: string;
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
  nodes?: number[];
  tags: OsmElementTags;
}

export type OverpassApiMapResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OsmElement[];
};

interface OsmBaseApi {
  type: 'node' | 'way' | 'relation';
  id: number;
  tags: OsmElementTags;
}

export interface OsmNodeApi extends OsmBaseApi {
  type: 'node';
  lat: number;
  lon: number;
}

export interface OsmWayApi extends OsmBaseApi {
  type: 'way';
  nodes: number[];
}

export interface OsmRelationApi extends OsmBaseApi {
  type: 'relation';
  nodes: number[];
}

export type OsmElementApi = OsmNodeApi | OsmWayApi | OsmRelationApi;

export type OverpassApiNodeResponse = Omit<OverpassApiResponse, 'elements'> & {
  elements: OsmNodeApi[];
};
