/**
 * Global TypeScript Types
 *
 * Add shared types and interfaces here.
 * Feature-specific types should go in their respective directories.
 */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/** Standard pagination params */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Standard paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
