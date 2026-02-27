export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
