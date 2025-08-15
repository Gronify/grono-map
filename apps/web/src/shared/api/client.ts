import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL } from '../config';

export const client = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized – maybe redirect to login');
    }
    return Promise.reject(error);
  },
);

export async function apiGet<T = any>(url: string, params = {}): Promise<T> {
  const res: AxiosResponse<T> = await client.get(url, { params });
  return res.data;
}

export async function apiPost<T = any, D = any>(
  url: string,
  data: D,
): Promise<T> {
  const res: AxiosResponse<T> = await client.post(url, data);
  return res.data;
}

export async function apiRequest<T, B = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: B,
): Promise<T> {
  const res: AxiosResponse<T> = await client.request({ method, url, data });
  return res.data;
}
