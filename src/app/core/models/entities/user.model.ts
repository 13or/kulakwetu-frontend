import { RoleModel, RoleType } from './role.model';

export enum UserStatus {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  Suspended = 'SUSPENDED',
  Pending = 'PENDING',
}

export interface UserProfileModel {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export interface UserModel {
  id: string;
  username: string;
  status: UserStatus;
  accountType: RoleType;
  enabled: boolean;
  verified: boolean;
  profile?: UserProfileModel | null;
  roles: RoleModel[];
  createdAt?: string;
  updatedAt?: string | null;
}
