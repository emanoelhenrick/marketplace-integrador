import {
  CreateProductDto,
  StatusUpdateDto,
  StockUpdateDto,
  ProductFiltersDto,
  UpdateProductDto,
} from "../dto/product.dto";
import { BusinessError } from "../errors/business-error";

export interface ValidatedCreateProductData {
  name: string;
  category: string;
  price: number;
  location: string;
  description: string | null;
  image: string | null;
  quantity: number;
}

export interface ValidatedUpdateProductData {
  name: string;
  category: string;
  price: number;
  location?: string;
  description?: string;
  image?: string;
}

const MAX_PRICE = 99999999.99;
const MAX_QUANTITY = 2147483647;

export function validateCreateProduct(
  data: CreateProductDto
): ValidatedCreateProductData {
  const missingFields: string[] = [];

  if (isBlank(data.name)) {
    missingFields.push("nome");
  }

  if (isBlank(data.category)) {
    missingFields.push("categoria");
  }

  if (data.price === undefined || data.price === null || isBlank(data.price)) {
    missingFields.push("preço");
  }

  if (missingFields.length > 0) {
    throw new BusinessError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}.`
    );
  }

  const price = parsePrice(data.price as number | string);
  const quantity = parseQuantity(data.quantity);

  return {
    name: data.name!.trim(),
    category: data.category!.trim(),
    price,
    location: data.location?.trim() ?? "",
    description: data.description?.trim() || null,
    image: data.image?.trim() || null,
    quantity,
  };
}

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

export function parsePrice(value: number | string): number {
  const normalizedValue = typeof value === "string" ? value.trim().replace(",", ".") : String(value);

  if (!isNumericPrice(normalizedValue)) {
    throw new BusinessError("Preço inválido.");
  }

  const price = Number(normalizedValue);

  if (!Number.isFinite(price)) {
    throw new BusinessError("Preço inválido.");
  }

  if (price <= 0) {
    throw new BusinessError("O preço deve ser maior que zero.");
  }

  if (getDecimalPlaces(normalizedValue) > 2) {
    throw new BusinessError("O preço deve ter no máximo 2 casas decimais.");
  }

  if (price > MAX_PRICE) {
    throw new BusinessError("O preço informado excede o valor máximo permitido.");
  }

  return price;
}

function isNumericPrice(value: string): boolean {
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value);
}

function getDecimalPlaces(value: string): number {
  const [coefficient, exponentText] = value.toLowerCase().split("e");
  const decimalPlaces = coefficient.split(".")[1]?.length ?? 0;
  const exponent = exponentText ? Number(exponentText) : 0;

  return Math.max(0, decimalPlaces - exponent);
}

export function parseQuantity(value: CreateProductDto["quantity"]): number {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return 0;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      throw new BusinessError(
        "A quantidade deve ser um número inteiro maior ou igual a zero."
      );
    }

    if (value > MAX_QUANTITY) {
      throw new BusinessError("A quantidade informada excede o valor máximo permitido.");
    }

    return value;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    throw new BusinessError(
      "A quantidade deve ser um número inteiro maior ou igual a zero."
    );
  }

  const quantity = Number(value.trim());

  if (quantity > MAX_QUANTITY) {
    throw new BusinessError("A quantidade informada excede o valor máximo permitido.");
  }

  if (!Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 0) {
    throw new BusinessError(
      "A quantidade deve ser um número inteiro maior ou igual a zero."
    );
  }

  return quantity;
}

export function validateUpdateProduct(
  data: UpdateProductDto
): ValidatedUpdateProductData {
  const missingFields: string[] = [];

  if (isBlank(data.name)) {
    missingFields.push("nome");
  }

  if (isBlank(data.category)) {
    missingFields.push("categoria");
  }

  if (data.price === undefined || data.price === null || isBlank(data.price)) {
    missingFields.push("preço");
  }

  if (missingFields.length > 0) {
    throw new BusinessError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}.`
    );
  }

  return {
    name: data.name!.trim(),
    category: data.category!.trim(),
    price: parsePrice(data.price as number | string),
    ...(isBlank(data.location) ? {} : { location: data.location!.trim() }),
    ...(isBlank(data.description) ? {} : { description: data.description!.trim() }),
    ...(isBlank(data.image) ? {} : { image: data.image!.trim() }),
  };
}

export function validateStockUpdate(data: StockUpdateDto): number {
  if (
    data.quantity === undefined ||
    data.quantity === null ||
    (typeof data.quantity === "string" && data.quantity.trim() === "")
  ) {
    throw new BusinessError("Campos obrigatórios não preenchidos: quantidade.");
  }

  return parseQuantity(data.quantity);
}

export function validateStatusUpdate(data: StatusUpdateDto): boolean {
  if (typeof data.active !== "boolean") {
    throw new BusinessError("O campo ativo deve ser verdadeiro ou falso.");
  }

  return data.active;
}

export function validateProductFilters(query: unknown): ProductFiltersDto {
  if (typeof query !== "object" || query === null) {
    return {};
  }

  const category = (query as Record<string, unknown>).category;

  if (category === undefined) {
    return {};
  }

  if (typeof category !== "string") {
    throw new BusinessError("Parâmetro de categoria inválido.");
  }

  const normalizedCategory = category.trim();

  if (normalizedCategory.length > 100) {
    throw new BusinessError("Parâmetro de categoria inválido.");
  }

  return normalizedCategory ? { category: normalizedCategory } : {};
}