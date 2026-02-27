import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { PageableParams } from '../models/openapi-common.model';
import {
  SubscriptionTypePage,
  SubscriptionTypeRequest,
  SubscriptionTypeResponse,
} from '../models/openapi-admin.model';
import { CoreApiService } from '../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AdminSubscriptionsApiService {
  private readonly coreApiService = inject(CoreApiService);

  list(pageable: PageableParams): Observable<SubscriptionTypePage> {
    return this.coreApiService.get<SubscriptionTypePage>(API_ENDPOINTS.admin.subscriptions.base, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    });
  }

  getById(id: string): Observable<SubscriptionTypeResponse> {
    return this.coreApiService.get<SubscriptionTypeResponse>(API_ENDPOINTS.admin.subscriptions.byId(id));
  }

  create(payload: SubscriptionTypeRequest): Observable<SubscriptionTypeResponse> {
    return this.coreApiService.post<SubscriptionTypeResponse, SubscriptionTypeRequest>(
      API_ENDPOINTS.admin.subscriptions.base,
      payload,
    );
  }

  update(id: string, payload: SubscriptionTypeRequest): Observable<SubscriptionTypeResponse> {
    return this.coreApiService.put<SubscriptionTypeResponse, SubscriptionTypeRequest>(
      API_ENDPOINTS.admin.subscriptions.byId(id),
      payload,
    );
  }

  delete(id: string): Observable<void> {
    return this.coreApiService.delete<void>(API_ENDPOINTS.admin.subscriptions.byId(id));
  }
}
