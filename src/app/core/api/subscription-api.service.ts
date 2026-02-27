import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { PagedResponse } from '../models/paged-response.model';
import { SubscriptionDto } from '../models/subscription.model';
import { CoreApiService } from '../service/core-api.service';

interface SpringPage<T> {
  content?: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionApiService {
  private readonly coreApiService = inject(CoreApiService);

  list(page: number, size: number): Observable<PagedResponse<SubscriptionDto>> {
    return this.coreApiService
      .get<SpringPage<SubscriptionDto>>(API_ENDPOINTS.legacy.subscriptions.base, {
        params: { page, size },
      })
      .pipe(
        map((response) => ({
          content: response.content ?? [],
          page: response.number ?? page,
          size: response.size ?? size,
          totalElements: response.totalElements ?? 0,
          totalPages: response.totalPages ?? 0,
        })),
      );
  }
}
