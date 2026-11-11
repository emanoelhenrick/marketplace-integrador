import {
  CreateProductDto,
  StatusUpdateDto,
  StockUpdateDto,
  UpdateProductDto,
} from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";
import {
  validateCreateProduct,
  validateStatusUpdate,
  validateStockUpdate,
  validateProductFilters,
  validateUpdateProduct,
} from "../validators/product.validator";

export class ProductService {
  constructor(
    private readonly productRepository = new ProductRepository(),
    private readonly userRepository = new UserRepository()
  ) {}

  async create(
    artisan: { id: string; email: string; role: string },
    data: CreateProductDto
  ) {
    if (artisan.role !== "artisan") {
      throw new ForbiddenError("Usuário sem permissão para cadastrar produtos.");
    }

    const validatedData = validateCreateProduct(data);
    const artisanUser = await this.userRepository.findById(artisan.id);

    if (!artisanUser) {
      throw new NotFoundError("Artesão não encontrado.");
    }

    const location = validatedData.location || artisanUser.location?.trim();

    if (!location) {
      throw new BusinessError("Localização é obrigatória.");
    }

    const product = await this.productRepository.create({
      name: validatedData.name,
      price: validatedData.price,
      stars: 0,
      category: validatedData.category,
      artisan: artisanUser.name,
      artisanId: artisan.id,
      location,
      image: validatedData.image,
      description: validatedData.description,
      quantity: validatedData.quantity,
      active: true,
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      artisan: product.artisan,
      location: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
      createdAt: product.createdAt,
    };
  }

  async listByArtisan(artisan: { id: string; email: string; role: string }) {
    if (artisan.role !== "artisan") {
      throw new ForbiddenError(
        "Usuário sem permissão para consultar estoque de produtos."
      );
    }

    const products = await this.productRepository.findByArtisanId(artisan.id);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stars: product.stars,
      category: product.category,
      location: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
    }));
  }

  async list(query: unknown) {
    const filters = validateProductFilters(query);
    const products = await this.productRepository.findActive(filters);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stars: product.stars,
      category: product.category,
      artisan: product.artisan,
      location: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
    }));
  }

  async getPublicById(productId: string) {
    const parsedProductId = Number(productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const product = await this.productRepository.findById(parsedProductId);

    if (!product || !product.active) {
      throw new NotFoundError("Produto não encontrado.");
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stars: product.stars,
      category: product.category,
      artisan: product.artisan,
      location: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
    };
  }

  async getStock(
    artisan: { id: string; email: string; role: string },
    productId: string
  ) {
    if (artisan.role !== "artisan") {
      throw new ForbiddenError(
        "Usuário sem permissão para consultar estoque de produtos."
      );
    }

    const parsedProductId = Number(productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const product = await this.productRepository.findById(parsedProductId);

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    if (product.artisanId !== artisan.id) {
      throw new ForbiddenError("Você não tem permissão para acessar este produto.");
    }

    return {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
    };
  }

  async update(
    artisan: { id: string; email: string; role: string },
    productId: string,
    data: UpdateProductDto
  ) {
    this.ensureArtisanCanUpdate(artisan.role);

    const product = await this.findOwnedProduct(artisan.id, productId);
    const validatedData = validateUpdateProduct(data);
    const updatedProduct = await this.productRepository.updateByIdAndArtisanId(
      product.id,
      artisan.id,
      validatedData
    );

    if (!updatedProduct) {
      throw new ForbiddenError("Você não tem permissão para alterar este produto.");
    }

    return this.toUpdateResponse(updatedProduct);
  }

  async updateStatus(
    artisan: { id: string; email: string; role: string },
    productId: string,
    data: StatusUpdateDto
  ) {
    this.ensureArtisanCanUpdate(artisan.role);

    const product = await this.findOwnedProduct(artisan.id, productId);
    const active = validateStatusUpdate(data);
    const updatedProduct = await this.productRepository.updateByIdAndArtisanId(
      product.id,
      artisan.id,
      { active }
    );

    if (!updatedProduct) {
      throw new ForbiddenError("Você não tem permissão para alterar este produto.");
    }

    return this.toUpdateResponse(updatedProduct);
  }

  async updateStock(
    artisan: { id: string; email: string; role: string },
    productId: string,
    data: StockUpdateDto
  ) {
    this.ensureArtisanCanUpdate(artisan.role);

    const product = await this.findOwnedProduct(artisan.id, productId);
    const quantity = validateStockUpdate(data);
    const updatedProduct = await this.productRepository.updateByIdAndArtisanId(
      product.id,
      artisan.id,
      { quantity }
    );

    if (!updatedProduct) {
      throw new ForbiddenError("Você não tem permissão para alterar este produto.");
    }

    return this.toUpdateResponse(updatedProduct);
  }

  private ensureArtisanCanUpdate(role: string) {
    if (role !== "artisan") {
      throw new ForbiddenError("Usuário sem permissão para alterar produtos.");
    }
  }

  private async findOwnedProduct(artisanId: string, productId: string) {
    const parsedProductId = Number(productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const product = await this.productRepository.findById(parsedProductId);

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    if (product.artisanId !== artisanId) {
      throw new ForbiddenError("Você não tem permissão para alterar este produto.");
    }

    return product;
  }

  private toUpdateResponse(product: ProductEntity) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      artisan: product.artisan,
      location: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
      updatedAt: product.updatedAt,
    };
  }

  private isAvailable(quantity: number, active: boolean) {
    return quantity > 0 && active;
  }
}