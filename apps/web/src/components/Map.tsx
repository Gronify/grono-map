'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Pane,
  Circle,
  ImageOverlay,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useMapEvent, useMapEvents } from 'react-leaflet/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function FindLocation() {
  const map = useMapEvents({
    click: () => {
      map.locate();
    },
    locationfound: (location) => {
      console.log('location found:', location);
    },
  });
  return null;
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
  const [draggable, setDraggable] = useState(true);

  const eventHandlers = useMemo(
    () => ({
      drag(e: L.LeafletEvent) {
        const marker = e.target as L.Marker;
        circleRef.current?.setLatLng(marker.getLatLng());
      },
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          onPositionChange(marker.getLatLng());
        }
      },
    }),
    [circleRef, onPositionChange],
  );

  const toggleDraggable = useCallback(() => setDraggable((d) => !d), []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      //BUG:
      // icon={L.icon({
      //   iconUrl: '/marker-icon.png',
      //   iconSize: [25, 41],
      //   iconAnchor: [12, 41],
      // })}
    >
      <Popup>
        <span onClick={toggleDraggable}>
          {draggable ? 'Marker is draggable' : 'Click to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}

export default function Map() {
  const [markerPos, setMarkerPos] = useState<LatLngExpression>([
    50.4501, 30.5234,
  ]);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const position: LatLngExpression = [50.4501, 30.5234];
  const multiPolygon: LatLngExpression[][] = [
    [
      [50.44, 30.52],
      [50.44, 30.53],
      [50.46, 30.54],
    ],
    [
      [50.46, 30.54],
      [50.51, 30.53],
      [50.52, 30.54],
    ],
  ];
  const purpleOptions = { color: 'purple' };
  const fillBlueOptions = { fillColor: 'blue' };

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setMarkerPos([lat, lng]);
    circleRef.current?.setLatLng(e.latlng);
  }, []);

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
      <FindLocation />
      <SetMarker />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle
        center={circleRef.current?.getLatLng() ?? markerPos}
        pathOptions={fillBlueOptions}
        radius={1000}
        ref={circleRef}
      />
      <DraggableMarker
        circleRef={circleRef}
        position={markerPos}
        onPositionChange={setMarkerPos}
      />
    </MapContainer>
  );
}
