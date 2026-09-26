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