// NEW FILE: src/app/core/api/admin/admin-currency-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { CurrencyPage, CurrencyRequest, CurrencyResponse } from '../../models/openapi-admin-extended.model';
import { PageableParams } from '../../models/openapi-common.model';
import { CoreApiService } from '../../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AdminCurrencyApiService {
  private readonly coreApiService = inject(CoreApiService);

  list(pageable: PageableParams): Observable<CurrencyPage> {
    return this.coreApiService.get<CurrencyPage>(API_ENDPOINTS.admin.reference.currencies, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    });
  }

  create(payload: CurrencyRequest): Observable<CurrencyResponse> {
    return this.coreApiService.post<CurrencyResponse, CurrencyRequest>(API_ENDPOINTS.admin.reference.currencies, payload);
  }
}
