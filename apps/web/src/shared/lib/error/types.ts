export type ErrorModel = {
  code?: number;
  message: string;
  type?: 'network' | 'server' | 'validation' | 'unknown';
};
