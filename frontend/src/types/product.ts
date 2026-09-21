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
