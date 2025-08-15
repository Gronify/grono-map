'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useMapEvent } from 'react-leaflet/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface MapProps {
  position: LatLngExpression;
  radius?: number;
  setPosition: (pos: LatLngExpression) => void;
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
}: MapProps) {
  const circleRef = useRef<L.Circle | null>(null);
  const fillBlueOptions = { fillColor: 'blue' };

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

      <Circle
        center={circleRef.current?.getLatLng() ?? position}
        pathOptions={fillBlueOptions}
        radius={radius}
        ref={circleRef}
      />
      <DraggableMarker
        circleRef={circleRef}
        position={position}
        onPositionChange={setPosition}
      />
    </MapContainer>
  );
}
