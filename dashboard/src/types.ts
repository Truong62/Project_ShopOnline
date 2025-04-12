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