import { apiGet, apiRequest } from '@/shared/api/client';
import type { User } from '../lib/types';

export function getCurrentUser() {
  return apiGet<User>('/auth/me');
}

export function updateUser(data: Partial<User>) {
  return apiRequest<User, Partial<User>>('PATCH', '/auth/me', data);
}

export function deleteUser() {
  return apiRequest<void>('DELETE', '/auth/me');
}
