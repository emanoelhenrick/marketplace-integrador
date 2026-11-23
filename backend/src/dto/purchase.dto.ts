export interface PurchaseItemDto {
  productId?: number | string;
  quantity?: number | string;
}

export interface FinalizePurchaseDto {
  items?: PurchaseItemDto[];
}
