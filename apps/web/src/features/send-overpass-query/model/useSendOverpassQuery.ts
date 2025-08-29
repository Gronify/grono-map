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
    } catch (e: any) {
      let message = 'Unexpected error occurred';

      if (e.response) {
        const status = e.response.status;
        switch (status) {
          case 400:
            message = 'Bad request. Please check your input.';
            break;
          case 401:
            message = 'Unauthorized';
            break;
          case 403:
            message = 'Forbidden. You do not have permission.';
            break;
          case 404:
            message = 'No data found for the given parameters.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = `Request failed with status ${status}`;
        }
      } else if (e.request) {
        message = 'No response from server.';
      } else if (e.code === 'ECONNABORTED') {
        message = 'Request timeout. Please try again.';
      } else {
        message = e.message || message;
      }

      toast.error(message, { id: toastId });
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
