import { CreateProductDto } from "../dto/product.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";
import { validateCreateProduct } from "../validators/product.validator";

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
      createdAt: product.createdAt,
    };
  }
}