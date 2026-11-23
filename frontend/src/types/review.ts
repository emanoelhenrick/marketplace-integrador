import type { Id } from "./common";

export interface Review {
  id: Id;
  productId: Id;
  /** Apenas o primeiro nome / apelido: nunca e-mail ou dados pessoais. */
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  /** true quando a avaliação é do usuário logado. */
  mine?: boolean;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}
