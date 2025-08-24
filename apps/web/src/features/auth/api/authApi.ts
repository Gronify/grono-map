import { apiPost, apiRequest } from '@/shared/api/client';

type LoginResponse = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
};

type RefreshResponse = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
};

export function login(data: { email: string; password: string }) {
  return apiPost<LoginResponse, typeof data>('/auth/email/login', data);
}

export function register(data: { email: string; password: string }) {
  return apiPost<void, typeof data>('/auth/email/register', data);
}

export function confirmEmail(data: { hash: string }) {
  return apiPost<void, typeof data>('/auth/email/confirm', data);
}

export function refresh() {
  return apiPost<RefreshResponse, {}>('/auth/refresh', {});
}

export function logout() {
  return apiRequest<void>('POST', '/auth/logout');
}
