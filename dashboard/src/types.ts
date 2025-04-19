export interface Size {
    size: string;
    quantity: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    sku: string;
    mainImage: string;
    subImages: string[];
    color: string;
    sizes: Size[];
    brand: string;
    description: string;
    price: string;
    purchaseUnit: number;
    stock: number;
    status: 'Deleted=0' | 'Released' | 'Unreleased';
    createdAt: string;
  }

export interface User {
  id: number;
  Description?: string | null;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'product_manager' | 'sale_manager';
  status: 'Active' | 'Inactive';
  createdAt: string;
}