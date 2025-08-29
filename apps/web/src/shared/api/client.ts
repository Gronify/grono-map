import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../config';

export const client = axios.create({
  baseURL: API_URL,
  // timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(client(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //bad bad bad
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Unauthorized');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);

        client.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        processQueue(null, data.token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
        }

        return client(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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
