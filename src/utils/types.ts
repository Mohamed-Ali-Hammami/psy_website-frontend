// src/utils/types.ts

export interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  phone_number?: string;        
  oldPassword?: string;
  newPassword?: string;
  profilePicture?: File | string;
}