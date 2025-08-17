'use client';

import { LatLngExpression } from 'leaflet';
import { MapView } from './MapView';
import { OsmElement } from '@/pages/map-page/ui/api/map-queries';
type MapWidgetProps = {
  position: LatLngExpression;
  radius?: number;
  setPosition: (pos: LatLngExpression) => void;
  elements?: OsmElement[];
};

export const Map = ({
  position,
  radius = 1000,
  setPosition,
  elements = [],
}: MapWidgetProps) => {
  return (
    <MapView
      position={position}
      radius={radius}
      onPositionChange={setPosition}
      elements={elements}
    />
  );
};

export default Map;
