// src/app/core/helpers/normalize-api-error.ts
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Requête invalide.',
  401: 'Vous devez être authentifié pour effectuer cette action.',
  403: "Vous n'avez pas les autorisations nécessaires.",
  500: 'Une erreur serveur est survenue.',
};

export function normalizeApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return {
      status: 0,
      code: 'UNKNOWN_ERROR',
      message: 'Une erreur inattendue est survenue.',
      url: null,
      details: error,
    };
  }

  const serverMessage =
    (error.error && (error.error.message || error.error.error)) ||
    error.message;

  return {
    status: error.status,
    code: `HTTP_${error.status || 0}`,
    message: serverMessage || DEFAULT_ERROR_MESSAGES[error.status] || 'Une erreur inattendue est survenue.',
    url: error.url,
    details: error.error,
  };
}
