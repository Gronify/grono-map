'use client';
import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { ChevronDown, Send } from 'lucide-react';
import { useCallback, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import {
  generateAndFetchOverpassQuery,
  OverpassQueryDto,
} from './api/map-queries';

type OsmElementTags = {
  [key: string]: string;
};
type OsmElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  longitude: number;
  latitude: number;
  nodes?: number[];
  tags: OsmElementTags;
};

type OverpassApiMapResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OsmElement[];
};

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function MapPage() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [radius, setRadius] = useState<number>(1000);
  const [markerPos, setMarkerPos] = useState<LatLngExpression>({
    lat: 50.4501,
    lng: 30.5234,
  });
  // Сохраняем массив объектов с бэка
  const [elements, setElements] = useState<OsmElement[]>([]);

  const handleSend = useCallback(async () => {
    try {
      console.log(markerPos);
      const { lat, lng } = markerPos as { lat: number; lng: number };

      const payload: OverpassQueryDto = {
        input: text,
        latitude: lat,
        longitude: lng,
        radius,
      };

      const data = await generateAndFetchOverpassQuery(payload);

      setElements(data.elements);
      setText('');
    } catch (e) {
      console.error(e);
    }
  }, [text, radius, markerPos]);

  return (
    <div className="relative w-full h-screen">
      <Map
        position={markerPos}
        setPosition={setMarkerPos}
        radius={radius}
        elements={elements}
      />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[9999]">
        <div className="bg-white shadow-lg rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter query..."
              className="resize-none min-h-[50px] flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-[50px] w-[50px] cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Toggle */}
          <button
            className="flex items-center text-sm text-gray-600 gap-1 select-none"
            onClick={() => setOpen((prev) => !prev)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
            />
            Advance
          </button>

          {/* Accordion Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-1 flex gap-2">
              <Input
                type="number"
                placeholder="Radius in meters"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
