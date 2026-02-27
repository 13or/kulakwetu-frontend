export enum NotificationType {
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Error = 'ERROR',
}

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string | null;
  metadata?: Record<string, string | number | boolean | null> | null;
  createdAt: string;
  readAt?: string | null;
}
