import { useCallback, useState } from 'react';
import {
  generateAndFetchOverpassQuery,
  OsmElement,
  OverpassQueryDto,
} from '@/pages/map-page/ui/api/map-queries';
import { LatLngExpression } from 'leaflet';

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
      onSuccess(data.elements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [text, position, radius, onSuccess]);

  return { handleSend, isLoading };
};
