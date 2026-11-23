export interface AddCartItemDto {
  productId?: number | string;
  quantity?: number | string;
}

export interface UpdateCartItemDto {
  quantity?: number | string;
}
