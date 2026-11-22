export interface AddCartItemDto {
  productId?: number | string;
  produtoId?: number | string;
  quantity?: number | string;
  quantidade?: number | string;
}

export interface UpdateCartItemDto {
  quantity?: number | string;
  quantidade?: number | string;
}
