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
import { OsmElement } from '@/pages/map-page/ui/api/map-queries';
import { Button } from '../../../shared/components/ui/button';

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

interface MapControlsProps {
  pickMode: boolean;
  setPickMode: React.Dispatch<React.SetStateAction<boolean>>;
  onPick: (latlng: L.LatLng, bbox: BBox) => void;
}

interface BBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export function MapControls({
  pickMode,
  setPickMode,
  onPick,
}: MapControlsProps) {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!map) return;
    map.getContainer().style.cursor = pickMode ? 'help' : '';
  }, [pickMode, map]);

  useMapEvent('click', (e) => {
    if (pickMode) {
      const bounds = map.getBounds();
      const bbox = {
        minLat: bounds.getSouthWest().lat,
        minLon: bounds.getSouthWest().lng,
        maxLat: bounds.getNorthEast().lat,
        maxLon: bounds.getNorthEast().lng,
      };
      onPick(e.latlng, bbox);
      setPickMode(false);
    }
  });

  return (
    <div
      ref={containerRef}
      className="absolute top-4 left-4 z-[1000] flex flex-col gap-2"
    >
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
          map.zoomIn();
        }}
      >
        +
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
          map.zoomOut();
        }}
      >
        −
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
          setPickMode(true);
        }}
      >
        {pickMode ? '!' : '?'}
      </Button>
    </div>
  );
}

export const MapView = ({
  position,
  radius,
  elements,
  onPositionChange,
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
        onPick={(latlng, bbox) => {
          console.log('Check:', latlng);
          console.log('BBox:', bbox);
        }}
      />

      {elements.map((el) => (
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
                Tags: {Object.keys(el.tags).length}
              </div>

              <div className="text-xs text-gray-700 font-mono">
                {Object.entries(el.tags).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[150px_1fr] border-b border-gray-200 py-0.5"
                  >
                    <span className="font-medium text-gray-800">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
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
