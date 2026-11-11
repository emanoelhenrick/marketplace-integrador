export interface CreateProductDto {
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
  quantity?: number | string | null;
}

export interface UpdateProductDto {
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface StockUpdateDto {
  quantity?: number | string | null;
}

export interface StatusUpdateDto {
  active?: boolean;
}

export interface ProductFiltersDto {
  category?: string;
}