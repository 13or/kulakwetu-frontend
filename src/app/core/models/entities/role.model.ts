import { PermissionModel } from './permission.model';

export enum RoleType {
  SuperAdmin = 'SUPERADMIN',
  Admin = 'ADMIN',
  Supplier = 'SUPPLIER',
  Producer = 'PRODUCER',
  Consumer = 'CONSUMER',
}

export interface RoleModel {
  id: string;
  name: RoleType;
  label: string;
  description?: string | null;
  permissions: PermissionModel[];
  isSystem: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
