// src/app/core/models/api-error.model.ts
export interface ApiError {
  status: number;
  code: string;
  message: string;
  url: string | null;
  details?: unknown;
}
