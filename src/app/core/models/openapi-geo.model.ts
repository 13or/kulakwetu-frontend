export interface CountryResponse {
  id: string;
  name: string;
  isoCode: string;
  phoneCode: string;
  isPublic: boolean;
}

export interface ProvinceResponse {
  id: string;
  countryId: string;
  name: string;
  isPublic: boolean;
}

export interface CityResponse {
  id: string;
  provinceId: string;
  name: string;
  isPublic: boolean;
}

export interface MunicipalityResponse {
  id: string;
  cityId: string;
  name: string;
  isPublic: boolean;
}
