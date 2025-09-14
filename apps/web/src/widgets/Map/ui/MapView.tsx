'use client';

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  ZoomControl,
  AttributionControl,
  ScaleControl,
  LayersControl,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useRef, useState, useEffect, useCallback } from 'react';
import { DraggableMarker } from './DraggableMarker';
import { useMap, useMapEvent } from 'react-leaflet/hooks';
import {
  fetchAroundPoint,
  OsmElement,
  OverpassApiMapResponse,
} from '@/pages/map-page/ui/api/map-queries';
import { Button } from '../../../shared/components/ui/button';
import { BBox, MapControls } from './MapControls';
import { apiPost } from '../../../shared/api/client';

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
  onPick: (latlng: L.LatLng, bbox: BBox) => void;
}

export const MapView = ({
  position,
  radius,
  elements,
  onPositionChange,
  onPick,
}: Props) => {
  const circleRef = useRef<L.Circle | null>(null);
  const [pickMode, setPickMode] = useState(false);

  const handleClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (pickMode) return;
      onPositionChange(e.latlng);
      circleRef.current?.setLatLng(e.latlng);
    },
    [onPositionChange, pickMode],
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
      zoomControl={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ScaleControl position="bottomleft" />

      <ClickHandler />
      <MapControls
        pickMode={pickMode}
        setPickMode={setPickMode}
        onPick={onPick}
      />

      {elements.map((el) => {
        if (!el.tags) return null;
        return (
          <CircleMarker
            key={el.id}
            center={[el.latitude, el.longitude]}
            radius={10}
            pathOptions={elementsColorOptions}
          >
            <Popup>
              <div className="p-3 max-w-[500px] space-y-2">
                <h3 className="font-semibold text-sm text-gray-800 flex items-center justify-between">
                  {el.type} {el.id}
                </h3>
                <div className="text-xs text-gray-500">
                  Tags: {el.tags ? Object.keys(el.tags).length : 0}
                </div>

                <div className="text-xs text-gray-700 font-mono">
                  {el.tags
                    ? Object.entries(el?.tags).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-[150px_1fr] border-b border-gray-200 py-0.5"
                        >
                          <span className="font-medium text-gray-800">
                            {key}
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))
                    : ''}
                </div>

                <div className="text-xs text-gray-500 pt-2">
                  <span className="font-medium">Coordinates:</span>
                  <br />
                  {el.latitude} / {el.longitude}{' '}
                  <span className="text-gray-400">(lat/lon)</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
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
