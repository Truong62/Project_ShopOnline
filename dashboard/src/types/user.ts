export interface User {
  id: number;
  Description?: string | null;
  name: string;
  email: string;
  password?: string; // Added for password storage (not displayed in form)
  role: 'Admin' | 'Product Manager' | 'Sales Manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}