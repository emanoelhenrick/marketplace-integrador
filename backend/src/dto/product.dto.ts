export interface CreateProductDto {
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  location?: string | null;
  description?: string | null;
  image?: string | null;
  quantity?: number | string | null;
}