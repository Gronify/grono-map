import type { Metadata } from 'next';
import './styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from 'sonner';
import { UserProvider } from '@/entities/user/model/UserContext';

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
      <body>
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
