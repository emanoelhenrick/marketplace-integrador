export interface PurchaseItemDto {
  productId?: number | string;
  produtoId?: number | string;
  quantity?: number | string;
  quantidade?: number | string;
}

export interface FinalizePurchaseDto {
  items?: PurchaseItemDto[];
  itens?: PurchaseItemDto[];
}
