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
  export interface Users {
    id: number;
    name: string;
    Avatar: string;
    description: string;
    status: 'Deleted=0' | 'Active' | 'Inactive';
    role: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
  }