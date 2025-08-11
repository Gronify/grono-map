'use client';

import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

export default function Map() {
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

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
      <Marker
        position={[50.4501, 30.5234]}
        icon={L.icon({
          iconUrl: '/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      >
        <Popup>Hi!</Popup>
      </Marker>
    </MapContainer>
  );
}
