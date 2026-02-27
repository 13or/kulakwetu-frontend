// NEW FILE: src/app/core/api/admin/admin-system-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { CompanyInfoRequest, CompanyInfoResponse } from '../../models/openapi-admin-extended.model';
import { CoreApiService } from '../../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AdminSystemApiService {
  private readonly coreApiService = inject(CoreApiService);

  getCompanyInfo(): Observable<CompanyInfoResponse> {
    return this.coreApiService.get<CompanyInfoResponse>(API_ENDPOINTS.company.info);
  }

  updateCompanyInfo(payload: CompanyInfoRequest): Observable<CompanyInfoResponse> {
    return this.coreApiService.put<CompanyInfoResponse, CompanyInfoRequest>(API_ENDPOINTS.company.info, payload);
  }
}
