export type ErrorModel = {
  code?: number;
  message: string;
  type?: 'network' | 'server' | 'validation' | 'unknown';
};

export function mapError<E extends Error = Error>(e: unknown): ErrorModel {
  if ((e as E) instanceof Error) {
    const error = e as E;

    if ((error as any).isAxiosError) {
      const axiosErr = error as any;

      if (axiosErr?.response) {
        const status = axiosErr.response.status;
        const messages: Record<number, string> = {
          400: 'Bad request. Please check your input.',
          401: 'Unauthorized. Please log in.',
          403: 'Forbidden. You do not have permission.',
          404: 'No data found for the given parameters.',
          500: 'Server error. Please try again later.',
        };
        return {
          code: status,
          message: messages[status] || `Request failed (${status})`,
          type: 'server',
        };
      }
    }
    console.log('1');

    return { message: error.message, type: 'unknown' };
  }
  return { message: 'Unexpected error', type: 'unknown' };
}
