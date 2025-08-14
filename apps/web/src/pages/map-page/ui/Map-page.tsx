'use client';
import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function MapPage() {
  return (
    <div className="relative w-full h-screen">
      <Map />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-[9999]">
        <div className="flex items-end gap-2 bg-white shadow-lg rounded-2xl p-3">
          <Textarea
            placeholder="Enter query..."
            className="resize-none min-h-[50px] flex-1"
          />
          <Button size="icon" className="h-[50px] w-[50px] cursor-pointer">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
