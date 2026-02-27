// NEW FILE: src/app/core/api/admin/admin-activity-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { LedgerJournalResponse } from '../../models/openapi-admin-extended.model';
import { CoreApiService } from '../../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AdminActivityApiService {
  private readonly coreApiService = inject(CoreApiService);

  journals(): Observable<LedgerJournalResponse[]> {
    return this.coreApiService.get<LedgerJournalResponse[]>(API_ENDPOINTS.agricash.admin.ledgerJournals);
  }
}
