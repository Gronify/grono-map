import type { Metadata } from 'next';
import './styles/globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'Grono-map',
  description: 'coming soon...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
