'use client';

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useRef, useState, useEffect, useCallback } from 'react';
import { DraggableMarker } from './DraggableMarker';
import { useMapEvent } from 'react-leaflet/hooks';
import { OsmElement } from '@/pages/map-page/ui/api/map-queries';

const fillBlueOptions = {
  fillColor: 'blue',
  color: 'blue',
  fillOpacity: 0.1,
  opacity: 0.5,
};
const elementsColorOptions = {
  fillColor: 'red',
  color: 'blue',
  fillOpacity: 0.2,
  opacity: 0.4,
};

interface Props {
  position: LatLngExpression;
  radius: number;
  elements: OsmElement[];
  onPositionChange: (pos: LatLngExpression) => void;
}

export const MapView = ({
  position,
  radius,
  elements,
  onPositionChange,
}: Props) => {
  const circleRef = useRef<L.Circle | null>(null);

  const handleClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      onPositionChange(e.latlng);
      circleRef.current?.setLatLng(e.latlng);
    },
    [onPositionChange],
  );

  function ClickHandler() {
    useMapEvent('click', handleClick);
    return null;
  }

  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <ClickHandler />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {elements.map((el) => (
        <CircleMarker
          key={el.id}
          center={[el.latitude, el.longitude]}
          radius={10}
          pathOptions={elementsColorOptions}
        >
          <Popup>
            <div className="space-y-1">
              {Object.entries(el.tags).map(([key, value]) => (
                <div key={key}>
                  <strong className="capitalize">{key}: </strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </Popup>
        </CircleMarker>
      ))}
      <Circle
        center={circleRef.current?.getLatLng() ?? position}
        pathOptions={fillBlueOptions}
        radius={radius}
        ref={circleRef}
        interactive={false}
      />
      <DraggableMarker
        circleRef={circleRef}
        position={position}
        onPositionChange={onPositionChange}
      />
    </MapContainer>
  );
};
