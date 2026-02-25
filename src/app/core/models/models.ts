export interface pageSelection {
  skip: number;
  limit: number;
}
export interface apiResultFormat {
  data: [];
  totalData: number;
}


export type Role =
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_ADMIN'
  | 'ROLE_SELLER'
  | 'ROLE_SUPPLIER'
  | 'ROLE_PRODUCER'
  | 'ROLE_CONSUMER';

export interface AuthUser {
  id: number;
  username: string;
  roles: Role[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer' | string;
  user: AuthUser;
}

