import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useRef, useCallback } from 'react';

type Props = {
  circleRef: React.RefObject<L.Circle | null>;
  position: LatLngExpression;
  onPositionChange: (pos: LatLngExpression) => void;
};

export function DraggableMarker({
  circleRef,
  position,
  onPositionChange,
}: Props) {
  const markerRef = useRef<L.Marker | null>(null);

  const handleDrag = useCallback((e: L.LeafletEvent) => {
    const marker = e.target as L.Marker;
    circleRef.current?.setLatLng(marker.getLatLng());
  }, []);

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
