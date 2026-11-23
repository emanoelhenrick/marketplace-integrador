import type { Artisan } from "./artisan";
import type { Id, ModerationStatus } from "./common";

export interface Product {
  id: Id;
  name: string;
  description: string;
  story?: string;
  price: number;
  image: string;
  category: string;
  technique?: string;
  region?: string;
  location: string;
  stars: number;
  reviewsCount?: number;
  stock: number;
  active: boolean;
  moderationStatus?: ModerationStatus;
  artisanId: Id;
  artisan?: Artisan;
  quantity: number;
}

/** Valores do formulário (tudo string, como digitado). */
export interface ProductFormValues {
  name: string;
  description: string;
  story: string;
  price: string;
  stock: string;
  image: string;
  category: string;
  technique: string;
  region: string;
  location: string;
}

/** Payload validado enviado à API. */
export interface ProductInput {
  name: string;
  description: string;
  story: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  technique: string;
  region: string;
  location: string;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  technique?: string;
  region?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
