import { useCallback, useState } from 'react';
import {
  generateAndFetchOverpassQuery,
  OsmElement,
  OverpassQueryDto,
} from '@/pages/map-page/ui/api/map-queries';
import { LatLngExpression } from 'leaflet';
import { toast } from 'sonner';

export const useSendOverpassQuery = ({
  text,
  position,
  radius,
  onSuccess,
}: {
  text: string;
  position: LatLngExpression;
  radius: number;
  onSuccess: (elements: OsmElement[]) => void;
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    const toastId = toast.loading('Loading...');
    try {
      const { lat, lng } = position as { lat: number; lng: number };
      const payload: OverpassQueryDto = {
        input: text,
        latitude: lat,
        longitude: lng,
        radius,
      };
      setLoading(true);
      const data = await generateAndFetchOverpassQuery(payload);
      toast.success(`Found: ${data.elements.length} elements`, { id: toastId });
      onSuccess(data.elements);
    } catch (e) {
      toast.error(`Error while requesting`, { id: toastId });
      console.error(e);
    } finally {
      setLoading(false);
      /* setTimeout(() => {
        toast.dismiss(toastId);
      }, 4000);*/
    }
  }, [text, position, radius, onSuccess]);

  return { handleSend, isLoading };
};
