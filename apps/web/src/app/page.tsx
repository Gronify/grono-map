// import dynamic from 'next/dynamic';

import { MapPage } from '@/pages/map-page';

// const MapPage = dynamic(() => import('@/pages/map-page'), { ssr: false });
export default function Home() {
  return <MapPage />;
}
