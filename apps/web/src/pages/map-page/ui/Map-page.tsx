'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { OsmElement } from './api/map-queries';
import {
  SendQueryForm,
  useSendOverpassQuery,
} from '@/features/send-overpass-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { LoginDialog } from '@/widgets/login-dialog/ui/LoginDialog';
import { Button } from '../../../shared/components/ui/button';

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

  const [open, setOpen] = useState(false);

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
        loading={isLoading}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="fixed top-4 right-4 z-[9999]">Login</Button>
        </DialogTrigger>

        <DialogContent className="z-[9999]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <LoginDialog onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
