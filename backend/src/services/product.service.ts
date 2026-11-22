import {
  CreateProductDto,
  StatusUpdateDto,
  StockUpdateDto,
  UpdateProductDto,
} from "../dto/product.dto";
import { ProductEntity } from "../entities/product.entity";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import {
  ProductRepository,
  UpdateProductInput,
} from "../repositories/product.repository";
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
    data: CreateProductDto,
    imageFile?: Express.Multer.File
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

    let image = validatedData.image;

    if (!imageFile && !image) {
      throw new BusinessError("A imagem do produto é obrigatória.");
    }

    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new BusinessError("A imagem deve ter no máximo 5 MB.");
      }

      if (!this.isSupportedProductImage(imageFile)) {
        throw new BusinessError("A imagem deve estar no formato PNG ou JPEG.");
      }

      image =
        `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
    }

    const product = await this.productRepository.create({
      name: validatedData.name,
      price: validatedData.price,
      stars: 0,
      category: validatedData.category,
      technique: validatedData.technique,
      artisan: artisanUser.name,
      artisanId: artisan.id,
      location,
      image,
      description: validatedData.description,
      quantity: validatedData.quantity,
      active: true,
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      technique: product.technique,
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
      title: product.name,
      price: product.price,
      stars: product.stars,
      category: product.category,
      technique: product.category,
      artisan: product.artisan,
      artisanId: product.artisanId,
      location: product.location,
      municipality: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
      availabilityStatus: this.isAvailable(product.quantity, product.active)
        ? "Disponível"
        : "Indisponível",
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
      title: product.name,
      price: product.price,
      stars: product.stars,
      category: product.category,
      technique: product.category,
      artisan: product.artisan,
      artisanId: product.artisanId,
      location: product.location,
      municipality: product.location,
      image: product.image,
      description: product.description,
      quantity: product.quantity,
      active: product.active,
      available: this.isAvailable(product.quantity, product.active),
      availabilityStatus: this.isAvailable(product.quantity, product.active)
        ? "Disponível"
        : "Indisponível",
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

    return this.persistProductUpdate(
      product.id,
      artisan.id,
      validatedData
    );
  }

  async updateStatus(
    artisan: { id: string; email: string; role: string },
    productId: string,
    data: StatusUpdateDto
  ) {
    this.ensureArtisanCanUpdate(artisan.role);

    const product = await this.findOwnedProduct(artisan.id, productId);
    const active = validateStatusUpdate(data);

    return this.persistProductUpdate(
      product.id,
      artisan.id,
      { active }
    );
  }

  async updateStock(
    artisan: { id: string; email: string; role: string },
    productId: string,
    data: StockUpdateDto
  ) {
    this.ensureArtisanCanUpdate(artisan.role);

    const product = await this.findOwnedProduct(artisan.id, productId);
    const quantity = validateStockUpdate(data);

    return this.persistProductUpdate(
      product.id,
      artisan.id,
      { quantity }
    );
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
      technique: product.technique,
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

  private isSupportedProductImage(file: Express.Multer.File) {
    if (file.mimetype === "image/png") {
      return (
        file.buffer.length >= 8 &&
        file.buffer.subarray(0, 8).equals(
          Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
        )
      );
    }

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      return (
        file.buffer.length >= 3 &&
        file.buffer[0] === 255 &&
        file.buffer[1] === 216 &&
        file.buffer[2] === 255
      );
    }

    return false;
  }

  private async persistProductUpdate(
    productId: number,
    artisanId: string,
    data: UpdateProductInput
  ) {
    const updatedProduct =
      await this.productRepository.updateByIdAndArtisanId(
        productId,
        artisanId,
        data
      );

    if (!updatedProduct) {
      throw new ForbiddenError(
        "Você não tem permissão para alterar este produto."
      );
    }

    return this.toUpdateResponse(updatedProduct);
  }
}
