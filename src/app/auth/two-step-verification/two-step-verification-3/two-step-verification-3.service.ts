import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class TwoStepVerification3Service {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  verifyCode(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}${API_ENDPOINTS.auth.verify}`, { token });
  }
}
