import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

/**
 * Normalized API error shape
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

/**
 * Response Interceptor
 *
 * Handles:
 * - Success response passthrough
 * - Error normalization into consistent ApiError shape
 * - 401 Unauthorized → clear auth and redirect to login
 * - Network error handling
 * - Development error logging
 */
export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Development logging
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error: AxiosError) => {
      const normalizedError: ApiError = {
        message: 'An unexpected error occurred',
        status: 0,
      };

      if (error.response) {
        // Server responded with an error status
        normalizedError.status = error.response.status;
        normalizedError.details = error.response.data;

        switch (error.response.status) {
          case 401:
            normalizedError.message = 'Unauthorized. Please log in again.';
            // Clear auth token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
            break;
          case 403:
            normalizedError.message = 'You do not have permission to perform this action.';
            break;
          case 404:
            normalizedError.message = 'The requested resource was not found.';
            break;
          case 422:
            normalizedError.message = 'Validation error. Please check your input.';
            break;
          case 500:
            normalizedError.message = 'Internal server error. Please try again later.';
            break;
          default:
            normalizedError.message =
              (error.response.data as { message?: string })?.message ||
              `Request failed with status ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        normalizedError.message = 'Network error. Please check your internet connection.';
        normalizedError.code = 'NETWORK_ERROR';
      } else {
        // Something else happened
        normalizedError.message = error.message || 'An unexpected error occurred';
      }

      // Development error logging
      if (import.meta.env.DEV) {
        console.error('[API Error]', normalizedError);
      }

      return Promise.reject(normalizedError);
    },
  );
};
