// src/app/core/models/user.model.ts
export interface UserDto {
  id: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  roles?: string[];
  status?: string;
  createdAt?: string;
}
