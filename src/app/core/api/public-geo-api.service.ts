import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { CityResponse, CountryResponse, MunicipalityResponse, ProvinceResponse } from '../models/openapi-geo.model';
import { CoreApiService } from '../service/core-api.service';

@Injectable({ providedIn: 'root' })
export class PublicGeoApiService {
  private readonly coreApiService = inject(CoreApiService);

  countries(): Observable<CountryResponse[]> {
    return this.coreApiService.get<CountryResponse[]>(API_ENDPOINTS.public.geo.countries);
  }

  provinces(countryId: string): Observable<ProvinceResponse[]> {
    return this.coreApiService.get<ProvinceResponse[]>(API_ENDPOINTS.public.geo.provinces(countryId));
  }

  cities(provinceId: string): Observable<CityResponse[]> {
    return this.coreApiService.get<CityResponse[]>(API_ENDPOINTS.public.geo.cities(provinceId));
  }

  municipalities(cityId: string): Observable<MunicipalityResponse[]> {
    return this.coreApiService.get<MunicipalityResponse[]>(API_ENDPOINTS.public.geo.municipalities(cityId));
  }
}
