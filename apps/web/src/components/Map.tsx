'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useMapEvent } from 'react-leaflet/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type OsmElementTags = {
  [key: string]: string;
};

type OsmElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  longitude: number;
  latitude: number;
  nodes?: number[];
  tags: OsmElementTags;
};

interface MapProps {
  position: LatLngExpression;
  radius?: number;
  setPosition: (pos: LatLngExpression) => void;
  elements?: OsmElement[];
}

function DraggableMarker({
  circleRef,
  position,
  onPositionChange,
}: {
  circleRef: React.RefObject<L.Circle | null>;
  position: LatLngExpression;
  onPositionChange: (pos: LatLngExpression) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  const handleDrag = useCallback(
    (e: L.LeafletEvent) => {
      const marker = e.target as L.Marker;
      circleRef.current?.setLatLng(marker.getLatLng());
    },
    [circleRef],
  );

  const handleDragEnd = useCallback(() => {
    if (markerRef.current) onPositionChange(markerRef.current.getLatLng());
  }, [onPositionChange]);

  return (
    <Marker
      draggable
      eventHandlers={{ drag: handleDrag, dragend: handleDragEnd }}
      position={position}
      ref={markerRef}
    >
      <Popup>Drag me!</Popup>
    </Marker>
  );
}

export default function Map({
  position,
  radius = 1000,
  setPosition,
  elements = [],
}: MapProps) {
  const circleRef = useRef<L.Circle | null>(null);
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

  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (setPosition) setPosition(e.latlng);
      circleRef.current?.setLatLng(e.latlng);
    },
    [setPosition],
  );

  function SetMarker() {
    useMapEvent('click', handleMapClick);
    return null;
  }

  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) return null;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <SetMarker />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
        onPositionChange={setPosition}
      />
    </MapContainer>
  );
}
