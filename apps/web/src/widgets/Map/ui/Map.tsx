'use client';

import { LatLngExpression } from 'leaflet';
import { MapView } from './MapView';
import { OsmElement } from '@/pages/map-page/ui/api/map-queries';
import { BBox } from './MapControls';

type MapWidgetProps = {
  position: LatLngExpression;
  radius?: number;
  setPosition: (pos: LatLngExpression) => void;
  elements?: OsmElement[];
  onPick: (latlng: L.LatLng, bbox: BBox) => void;
};

export const Map = ({
  position,
  radius = 1000,
  setPosition,
  elements = [],
  onPick,
}: MapWidgetProps) => {
  return (
    <MapView
      position={position}
      radius={radius}
      onPositionChange={setPosition}
      elements={elements}
      onPick={onPick}
    />
  );
};

export default Map;
