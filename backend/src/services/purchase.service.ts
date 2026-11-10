import { prisma } from "../prisma";
import { FinalizePurchaseDto } from "../dto/purchase.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { ProductEntity } from "../entities/product.entity";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/order-item.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";

export class PurchaseService {
  constructor(
    private readonly productRepository = new ProductRepository(),
    private readonly orderRepository = new OrderRepository(),
    private readonly orderItemRepository = new OrderItemRepository(),
    private readonly userRepository = new UserRepository()
  ) {}

  async finalizePurchase(
    buyer: { id: string; email: string; role: string },
    data: FinalizePurchaseDto
  ) {
    if (buyer.role !== "client") {
      throw new ForbiddenError("Usuário sem permissão para finalizar compras.");
    }

    const items = data?.items ?? data?.itens ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      throw new BusinessError("Itens da compra são obrigatórios.");
    }

    const parsedItems = items.map((item) => {
      const productId = Number(item.produtoId ?? item.productId);
      const quantity = Number(item.quantidade ?? item.quantity);

      if (!Number.isInteger(productId) || productId <= 0) {
        throw new NotFoundError("Produto não encontrado.");
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new BusinessError("A quantidade deve ser de no mínimo 1 unidade");
      }

      return {
        productId,
        quantity,
      };
    });

    const products = await Promise.all(
      parsedItems.map(({ productId }) => this.productRepository.findById(productId))
    );

    const validatedProducts = products.map((product, index) => {
      const requestedQuantity = parsedItems[index].quantity;

      if (!product) {
        throw new NotFoundError("Produto não encontrado.");
      }

      if (!product.active) {
        throw new BusinessError("Produto inativo não pode ser comprado.");
      }

      if (requestedQuantity > product.quantity) {
        throw new BusinessError(
          `Quantidade solicitada (${requestedQuantity}) excede o estoque disponível (${product.quantity})`
        );
      }

      return {
        product,
        quantity: requestedQuantity,
      };
    });

    const buyerUser = await this.userRepository.findById(buyer.id);

    return prisma.$transaction(async (tx) => {
      const itemsToPersist = await Promise.all(
        validatedProducts.map(async ({ product, quantity }) => {
          const currentProduct = await this.productRepository.findById(product.id, tx as any);

          if (!currentProduct) {
            throw new NotFoundError("Produto não encontrado.");
          }

          if (!currentProduct.active) {
            throw new BusinessError("Produto inativo não pode ser comprado.");
          }

          if (quantity > currentProduct.quantity) {
            throw new BusinessError(
              `Quantidade solicitada (${quantity}) excede o estoque disponível (${currentProduct.quantity})`
            );
          }

          return {
            product: currentProduct,
            quantity,
          };
        })
      );

      const totalAmount = itemsToPersist.reduce(
        (sum, { product, quantity }) => sum + Number(product.price) * quantity,
        0
      );

      const order = await this.orderRepository.create(
        {
          userId: buyer.id,
          customerName: buyerUser?.name ?? buyer.email,
          customerEmail: buyer.email,
          status: "paid",
          totalAmount,
        },
        tx as any
      );

      for (const { product, quantity } of itemsToPersist) {
        await this.orderItemRepository.create(
          {
            orderId: order.id,
            productId: product.id,
            quantity,
            unitPrice: Number(product.price),
            packed: false,
            artisanId: null,
          },
          tx as any
        );

        await this.productRepository.update(
          product.id,
          {
            quantity: product.quantity - quantity,
          },
          tx as any
        );
      }

      return {
        id: order.id,
        buyerId: buyer.id,
        totalAmount,
        items: itemsToPersist.map(({ product, quantity }) => ({
          produtoId: product.id,
          quantidade: quantity,
          valorUnitario: Number(product.price),
        })),
      };
    });
  }
}
