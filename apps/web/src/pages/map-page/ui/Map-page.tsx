'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { OsmElement } from './api/map-queries';
import {
  SendQueryForm,
  useSendOverpassQuery,
} from '@/features/send-overpass-query';

const Map = dynamic(() => import('@/widgets/Map/ui/Map'), { ssr: false });

export default function MapPage() {
  const [text, setText] = useState('');
  const [radius, setRadius] = useState<number>(1000);
  const [markerPos, setMarkerPos] = useState<LatLngExpression>({
    lat: 50.4501,
    lng: 30.5234,
  });
  const [elements, setElements] = useState<OsmElement[]>([]);
  const { handleSend } = useSendOverpassQuery({
    text,
    position: markerPos,
    radius,
    onSuccess: (elements) => {
      setElements(elements);
    },
  });

  return (
    <div className="relative w-full h-screen">
      <Map
        position={markerPos}
        setPosition={setMarkerPos}
        radius={radius}
        elements={elements}
      />
      <SendQueryForm
        text={text}
        radius={radius}
        onTextChange={setText}
        onRadiusChange={(val) => setRadius(val)}
        onSubmit={handleSend}
      />
    </div>
  );
}
