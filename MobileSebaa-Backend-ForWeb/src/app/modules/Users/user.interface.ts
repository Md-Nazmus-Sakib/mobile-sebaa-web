import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImg: string;
  role: 'Admin' | 'User' | 'Sp';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  isVerified: boolean;
  country: string;
};

export type TUserRole = keyof typeof USER_ROLE;
