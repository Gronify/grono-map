'use client';
import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { ChevronDown, Send } from 'lucide-react';
import { useState } from 'react';
import { LatLngExpression } from 'leaflet';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function MapPage() {
  const [open, setOpen] = useState(false);
  const [radius, setRadius] = useState<number>(1000);
  const [markerPos, setMarkerPos] = useState<LatLngExpression>([
    50.4501, 30.5234,
  ]);

  return (
    <div className="relative w-full h-screen">
      <Map position={markerPos} setPosition={setMarkerPos} radius={radius} />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[9999]">
        <div className="bg-white shadow-lg rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Enter query..."
              className="resize-none min-h-[50px] flex-1"
            />
            <Button size="icon" className="h-[50px] w-[50px] cursor-pointer">
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
