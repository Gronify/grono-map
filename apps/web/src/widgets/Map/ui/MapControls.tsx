import { useEffect, useRef } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { Button } from '../../../shared/components/ui/button';

type MapControlsProps = {
  pickMode: boolean;
  setPickMode: React.Dispatch<React.SetStateAction<boolean>>;
  onPick: (latlng: L.LatLng, bbox: BBox) => void;
};

interface BBox {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export const MapControls = ({
  pickMode,
  setPickMode,
  onPick,
}: MapControlsProps) => {
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
          setPickMode((prev) => !prev);
        }}
      >
        {pickMode ? '!' : '?'}
      </Button>
    </div>
  );
};
