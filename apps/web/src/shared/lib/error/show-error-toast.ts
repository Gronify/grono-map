import { toast } from 'sonner';
import { mapError } from './map-error';

export function showErrorToast(e: any, toastId?: string | number) {
  const message = mapError(e);
  toast.error(message.message, { id: toastId });
  console.error(e);
}
