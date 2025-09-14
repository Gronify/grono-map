'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { fetchAroundPoint, OsmElement } from './api/map-queries';
import {
  SendQueryForm,
  useSendOverpassQuery,
} from '@/features/send-overpass-query';
import { LoginDialog } from '@/widgets/login-dialog/ui/LoginDialog';
import { BBox } from '../../../widgets/Map/ui/MapControls';
import { toast } from 'sonner';
import { showErrorToast } from '../../../shared/lib/error';

const Map = dynamic(() => import('@/widgets/Map/ui/Map'), { ssr: false });

export default function MapPage() {
  const [text, setText] = useState('');
  const [radius, setRadius] = useState<number>(1000);
  const [markerPos, setMarkerPos] = useState<LatLngExpression>({
    lat: 50.4501,
    lng: 30.5234,
  });
  const [elements, setElements] = useState<OsmElement[]>([]);
  const { handleSend, isLoading } = useSendOverpassQuery({
    text,
    position: markerPos,
    radius,
    onSuccess: (elements) => {
      setElements(elements);
    },
  });

  const handlePick = async (latlng: L.LatLng, bbox: BBox) => {
    const toastId = toast.loading('Loading...');
    try {
      const data = await fetchAroundPoint({
        latitude: latlng.lat,
        longitude: latlng.lng,
        radius: 50,
      });
      toast.success(`Found: ${data.elements.length} elements`, { id: toastId });
      setElements(data.elements);
    } catch (error) {
      showErrorToast(error, toastId);
      console.error('around-point:', error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Map
        position={markerPos}
        setPosition={setMarkerPos}
        radius={radius}
        elements={elements}
        onPick={handlePick}
      />
      <SendQueryForm
        text={text}
        radius={radius}
        onTextChange={setText}
        onRadiusChange={(val) => setRadius(val)}
        onSubmit={handleSend}
        loading={isLoading}
      />

      <LoginDialog />
    </div>
  );
}
