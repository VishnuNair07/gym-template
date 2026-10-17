export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
