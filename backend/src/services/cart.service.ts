import { prisma } from "../prisma";
import { AddCartItemDto, UpdateCartItemDto } from "../dto/cart.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";

export class CartService {
  async getCart(buyer: { id: string; role: string }) {
    this.ensureClient(buyer.role);

    const cart = await prisma.cart.findUnique({
      where: { userId: buyer.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return this.toResponse(cart);
  }

  async addItem(
    buyer: { id: string; role: string },
    data: AddCartItemDto
  ) {
    this.ensureClient(buyer.role);

    const productId = Number(data.productId);
    const quantity = this.parseQuantity(data.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    if (!product.active) {
      throw new BusinessError("Produto indisponível.");
    }

    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId: buyer.id },
        update: {},
        create: { userId: buyer.id },
        include: { items: true },
      });

      const existing = cart.items.find((item) => item.productId === productId);
      const requestedQuantity = (existing?.quantity ?? 0) + quantity;

      if (requestedQuantity > product.quantity) {
        throw new BusinessError(
          `Quantidade solicitada (${requestedQuantity}) excede o estoque disponível (${product.quantity}).`
        );
      }

      await tx.cartItem.upsert({
        where: {
          cartId_productId: { cartId: cart.id, productId },
        },
        update: { quantity: requestedQuantity },
        create: { cartId: cart.id, productId, quantity },
      });

      return this.getCartWithClient(tx, buyer.id);
    });
  }

  async updateItem(
    buyer: { id: string; role: string },
    productIdValue: string,
    data: UpdateCartItemDto
  ) {
    this.ensureClient(buyer.role);
    const productId = Number(productIdValue);
    const quantity = this.parseQuantity(data.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: buyer.id },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundError("Carrinho não encontrado.");
    }

    const item = cart.items.find((cartItem) => cartItem.productId === productId);

    if (!item) {
      throw new NotFoundError("Item não encontrado no carrinho.");
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError("Produto não encontrado.");
    }

    if (!product.active) {
      throw new BusinessError("Produto indisponível.");
    }

    if (quantity > product.quantity) {
      throw new BusinessError(
        `Quantidade solicitada (${quantity}) excede o estoque disponível (${product.quantity}).`
      );
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(buyer);
  }

  async removeItem(
    buyer: { id: string; role: string },
    productIdValue: string
  ) {
    this.ensureClient(buyer.role);
    const productId = Number(productIdValue);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: buyer.id },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundError("Carrinho não encontrado.");
    }

    const item = cart.items.find((cartItem) => cartItem.productId === productId);

    if (!item) {
      throw new NotFoundError("Item não encontrado no carrinho.");
    }

    await prisma.cartItem.delete({ where: { id: item.id } });
    return this.getCart(buyer);
  }

  async clearCart(buyer: { id: string; role: string }) {
    this.ensureClient(buyer.role);
    await prisma.cart.deleteMany({ where: { userId: buyer.id } });
    return { items: [], subtotal: 0, total: 0 };
  }

  private ensureClient(role: string) {
    if (role !== "client") {
      throw new ForbiddenError("Somente compradores podem utilizar o carrinho.");
    }
  }

  private parseQuantity(value: unknown) {
    const quantity = typeof value === "string" ? Number(value) : value;

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new BusinessError("A quantidade deve ser um número inteiro maior que zero.");
    }

    return quantity;
  }

  private async getCartWithClient(client: any, userId: string) {
    const cart = await client.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return this.toResponse(cart);
  }

  private toResponse(cart: any) {
    if (!cart) {
      return { items: [], subtotal: 0, total: 0 };
    }

    const items = cart.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        image: item.product.image,
        quantity: item.product.quantity,
        active: item.product.active,
        available: item.product.active && item.product.quantity > 0,
      },
      subtotal: Number(item.product.price) * item.quantity,
    }));

    const subtotal = items.reduce(
      (sum: number, item: { subtotal: number }) => sum + item.subtotal,
      0
    );

    return { items, subtotal, total: subtotal };
  }
}
