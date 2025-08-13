'use client';
import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/button';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  return (
    <>
      <Button>Test</Button>
      <Map />
    </>
  );
}
