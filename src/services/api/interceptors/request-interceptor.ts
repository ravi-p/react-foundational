import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Request Interceptor
 *
 * Handles:
 * - Authorization token injection from localStorage
 * - Default Content-Type header
 * - Request logging in development mode
 */
export const setupRequestInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Inject auth token if available
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ensure Content-Type is set
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      // Development logging
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};
