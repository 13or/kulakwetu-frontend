export enum PermissionAction {
  Create = 'CREATE',
  Read = 'READ',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Manage = 'MANAGE',
}

export enum PermissionScope {
  User = 'USER',
  Role = 'ROLE',
  Wallet = 'WALLET',
  Currency = 'CURRENCY',
  Transaction = 'TRANSACTION',
  Notification = 'NOTIFICATION',
  System = 'SYSTEM',
}

export interface PermissionModel {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  action: PermissionAction;
  scope: PermissionScope;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
