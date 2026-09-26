<<<<<<< HEAD
import { Artisan } from "./artisan";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  location: string;
  stars: number;

  artisanId: number;
  artisan?: Artisan;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
=======
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  artisan?: string;
  location?: string;
  stars: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
>>>>>>> b183190bf7cb7c6c3dd7408c3d08cf427373cc17
