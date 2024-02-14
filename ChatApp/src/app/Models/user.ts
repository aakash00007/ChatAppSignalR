export interface User {
  id : string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOnline: boolean;
  isActive : boolean
}