export interface Size {
  size: string;
  quantity: number;
}

export interface Variant {
  color: string;
  mainImage: string | null;
  subImages: string[];
  sizes: Size[];
  price: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  mainImage?: string;
  subImages?: string[];
  color?: string;
  sizes?: Size[];
  brand: string;
  description: string;
  price?: string;
  purchaseUnit: number;
  stock?: number;
  status: 'Deleted=0' | 'Released' | 'Unreleased';
  createdAt: string;
  variants?: Variant[];
}
export interface User {
  id: number;
  Description?: string | null;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_Manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}
