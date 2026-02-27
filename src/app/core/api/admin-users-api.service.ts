import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { AdminUserPage, AdminUserResponse, AdminUserStatusRequest } from '../models/openapi-admin.model';
import { PageableParams } from '../models/openapi-common.model';
import { CoreApiService } from '../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class AdminUsersApiService {
  private readonly coreApiService = inject(CoreApiService);

  listSuppliers(pageable: PageableParams): Observable<AdminUserPage> {
    return this.coreApiService.get<AdminUserPage>(API_ENDPOINTS.admin.users.suppliers, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    });
  }

  listConsumers(pageable: PageableParams): Observable<AdminUserPage> {
    return this.coreApiService.get<AdminUserPage>(API_ENDPOINTS.admin.users.consumers, {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort?.join(','),
      },
    });
  }

  setActivation(id: string, payload: AdminUserStatusRequest): Observable<AdminUserResponse> {
    return this.coreApiService.patch<AdminUserResponse, AdminUserStatusRequest>(
      API_ENDPOINTS.admin.users.activation(id),
      payload,
    );
  }
}
