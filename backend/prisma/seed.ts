import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, OrderStatus } from "@prisma/client";

/**
 * Seed de demonstração alinhada ao schema atual:
 * - User: client / artisan / admin, com `active` e `culturalSeal`
 * - Product: `technique`, `quantity` e `active`
 * - Order / OrderItem, Review e Cart / CartItem
 *
 * Complementa a seed original (prisma/seed.ts) sem alterá-la: todos os ids
 * usam prefixos/faixas próprios ("demo-*", produtos 301+, pedidos 7000xx).
 * É idempotente (upsert) e pode ser executada várias vezes.
 *
 * Uso: npm run db:seed:demo
 */

if (process.env.NODE_ENV === "production") {
  throw new Error("A seed de demonstração não pode ser executada em produção.");
}

const prisma = new PrismaClient();

const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "Demo@123456";

const IMG = {
  barro1: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
  barro2: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
  renda: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
  xilo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
  madeira: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
  mascara: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
  textil1: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80",
  textil2: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80",
};

const AVATAR = {
  m1: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  f1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  m2: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
  f2: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
  m3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  m4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
};

/* ------------------------------------------------------------------ */
/* Usuários                                                            */
/* ------------------------------------------------------------------ */

const users = [
  // Compradores
  {
    id: "demo-client-1",
    name: "Camila Ferreira",
    email: "camila@demo.manoa.com.br",
    role: UserRole.client,
    active: true,
    avatarUrl: AVATAR.f1,
    phone: "(81) 99100-0001",
    createdAt: new Date("2026-06-02T10:00:00Z"),
  },
  {
    id: "demo-client-2",
    name: "Rafael Albuquerque",
    email: "rafael@demo.manoa.com.br",
    role: UserRole.client,
    active: true,
    avatarUrl: AVATAR.m1,
    phone: "(81) 99100-0002",
    createdAt: new Date("2026-06-15T14:30:00Z"),
  },
  {
    id: "demo-client-3",
    name: "Juliana Cavalcanti",
    email: "juliana@demo.manoa.com.br",
    role: UserRole.client,
    active: true,
    avatarUrl: AVATAR.f2,
    phone: "(81) 99100-0003",
    createdAt: new Date("2026-07-20T09:15:00Z"),
  },

  // Artesãos
  {
    id: "demo-artisan-1",
    name: "Mestre Zé do Barro",
    email: "ze.barro@demo.manoa.com.br",
    role: UserRole.artisan,
    active: true,
    avatarUrl: AVATAR.m3,
    phone: "(81) 99200-0001",
    createdAt: new Date("2026-05-01T08:00:00Z"),
    craft: "Cerâmica Figurativa",
    craftYears: "42 anos de ofício",
    quote: "O barro do Alto do Moura guarda a memória do nosso povo; cada figura conta uma história do agreste.",
    location: "Alto do Moura / Caruaru",
    polo: "Polo de Cerâmica do Alto do Moura",
    region: "Agreste",
    totalWorks: 120,
    culturalSeal: true,
  },
  {
    id: "demo-artisan-2",
    name: "Dona Rita Rendeira",
    email: "rita.renda@demo.manoa.com.br",
    role: UserRole.artisan,
    active: true,
    avatarUrl: AVATAR.f1,
    phone: "(87) 99200-0002",
    createdAt: new Date("2026-05-05T08:30:00Z"),
    craft: "Renda Renascença",
    craftYears: "35 anos de bilro",
    quote: "Cada ponto é feito à mão, no ritmo do bilro, como me ensinou minha avó.",
    location: "Poção / PE",
    polo: "Polo de Rendas do Agreste",
    region: "Agreste",
    totalWorks: 85,
    culturalSeal: true,
  },
  {
    id: "demo-artisan-3",
    name: "Mestre Antônio Xilo",
    email: "antonio.xilo@demo.manoa.com.br",
    role: UserRole.artisan,
    active: true,
    avatarUrl: AVATAR.m2,
    phone: "(81) 99200-0003",
    createdAt: new Date("2026-05-10T09:00:00Z"),
    craft: "Xilogravura e Cordel",
    craftYears: "38 anos de entalhe",
    quote: "Da madeira nasce a imagem, e da imagem nasce o cordel que o povo lê.",
    location: "Bezerros / PE",
    polo: "Polo de Xilogravura de Bezerros",
    region: "Agreste",
    totalWorks: 200,
    culturalSeal: true,
  },
  {
    id: "demo-artisan-4",
    name: "Mestre Chico Carranqueiro",
    email: "chico.carranca@demo.manoa.com.br",
    role: UserRole.artisan,
    active: true,
    avatarUrl: AVATAR.m4,
    phone: "(87) 99200-0004",
    createdAt: new Date("2026-05-15T08:45:00Z"),
    craft: "Escultura em Madeira",
    craftYears: "30 anos de Velho Chico",
    quote: "As carrancas protegem os barqueiros e a alma de quem vive do rio São Francisco.",
    location: "Petrolina / PE",
    polo: "Polo Vale do São Francisco",
    region: "Sertão",
    totalWorks: 60,
    culturalSeal: true,
  },
  {
    // Conta desativada: útil para testar o catálogo (produtos não devem aparecer)
    id: "demo-artisan-5",
    name: "Mestra Lourdes do Fuxico",
    email: "lourdes.fuxico@demo.manoa.com.br",
    role: UserRole.artisan,
    active: false,
    avatarUrl: AVATAR.f2,
    phone: "(81) 99200-0005",
    createdAt: new Date("2026-05-20T10:00:00Z"),
    craft: "Têxtil e Fuxico",
    craftYears: "20 anos de agulha",
    quote: "Retalho nenhum se perde quando há mão paciente para transformá-lo.",
    location: "Olinda / PE",
    polo: "Polo Têxtil da Zona da Mata",
    region: "Zona da Mata",
    totalWorks: 45,
    culturalSeal: false,
  },

  // Administrador
  {
    id: "demo-admin-1",
    name: "Administração Demo",
    email: "admin@demo.manoa.com.br",
    role: UserRole.admin,
    active: true,
    phone: "(81) 3000-0001",
    createdAt: new Date("2026-04-01T08:00:00Z"),
  },
];

/* ------------------------------------------------------------------ */
/* Produtos                                                            */
/* ------------------------------------------------------------------ */

type DemoProduct = {
  id: number;
  name: string;
  price: number;
  stars: number; // sobrescrito pela média das avaliações, quando houver
  category: string;
  technique: string;
  artisanId: string;
  location: string;
  image: string;
  description: string;
  quantity: number;
  active: boolean;
};

const artisanById = new Map(users.map((u) => [u.id, u]));

const products: DemoProduct[] = [
  // --- Mestre Zé do Barro (Cerâmica) ---
  {
    id: 301, name: "Casal de Noivos em Barro", price: 180, stars: 4.8,
    category: "Cerâmica & Barro", technique: "Modelagem em barro",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro1,
    description: "Figura de um casal de noivos modelada à mão em argila e queimada a lenha, com pintura em engobe.",
    quantity: 12, active: true,
  },
  {
    id: 302, name: "Cena de Feira em Barro", price: 260, stars: 4.6,
    category: "Cerâmica & Barro", technique: "Modelagem em barro",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro2,
    description: "Pequeno diorama com feirantes e bancas, retratando o cotidiano do agreste pernambucano.",
    quantity: 8, active: true,
  },
  {
    id: 303, name: "Moringa Tradicional", price: 95, stars: 4.4,
    category: "Cerâmica & Barro", technique: "Torno e queima a lenha",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro1,
    description: "Moringa de barro cru que mantém a água fresca naturalmente, queimada em forno a lenha.",
    quantity: 25, active: true,
  },
  {
    id: 304, name: "Sanfoneiro de Barro", price: 140, stars: 4.7,
    category: "Cerâmica & Barro", technique: "Modelagem em barro",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro2,
    description: "Figura de sanfoneiro em tamanho médio, símbolo do forró e das festas juninas.",
    quantity: 15, active: true,
  },
  {
    id: 305, name: "Presépio Pernambucano (Esgotado)", price: 390, stars: 4.9,
    category: "Cerâmica & Barro", technique: "Modelagem em barro",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro1,
    description: "Conjunto de nove peças em barro com a Sagrada Família, reis magos e animais.",
    quantity: 0, active: true, // estoque zero => indisponível
  },
  {
    id: 306, name: "Vaso Marajoara Pintado (Inativo)", price: 120, stars: 0,
    category: "Cerâmica & Barro", technique: "Pintura em engobe",
    artisanId: "demo-artisan-1", location: "Alto do Moura / Caruaru", image: IMG.barro2,
    description: "Vaso decorativo com grafismos inspirados na cerâmica marajoara.",
    quantity: 6, active: false, // produto desativado pelo artesão
  },

  // --- Dona Rita Rendeira (Rendas) ---
  {
    id: 307, name: "Toalha de Mesa em Renda Renascença", price: 450, stars: 4.9,
    category: "Rendas & Bordados", technique: "Renda renascença",
    artisanId: "demo-artisan-2", location: "Poção / PE", image: IMG.renda,
    description: "Toalha confeccionada manualmente em almofada de bilro com fios de algodão puro.",
    quantity: 5, active: true,
  },
  {
    id: 308, name: "Caminho de Mesa Bordado", price: 210, stars: 4.5,
    category: "Rendas & Bordados", technique: "Bordado richelieu",
    artisanId: "demo-artisan-2", location: "Poção / PE", image: IMG.textil1,
    description: "Caminho de mesa em linho com bordado richelieu e acabamento em ponto aberto.",
    quantity: 10, active: true,
  },
  {
    id: 309, name: "Jogo de Guardanapos Rendados", price: 150, stars: 4.6,
    category: "Rendas & Têxtil", technique: "Renda renascença",
    artisanId: "demo-artisan-2", location: "Poção / PE", image: IMG.renda,
    description: "Conjunto com seis guardanapos de algodão com barra em renda renascença.",
    quantity: 20, active: true,
  },
  {
    id: 310, name: "Blusa em Renda Artesanal", price: 320, stars: 4.8,
    category: "Rendas & Têxtil", technique: "Renda renascença",
    artisanId: "demo-artisan-2", location: "Poção / PE", image: IMG.textil2,
    description: "Blusa feminina com detalhes em renda feitos inteiramente à mão.",
    quantity: 7, active: true,
  },
  {
    id: 311, name: "Colcha de Cama Casal (Esgotada)", price: 980, stars: 5,
    category: "Rendas & Bordados", technique: "Bordado richelieu",
    artisanId: "demo-artisan-2", location: "Poção / PE", image: IMG.textil1,
    description: "Colcha em algodão cru com bordado richelieu, produzida sob encomenda.",
    quantity: 0, active: true,
  },

  // --- Mestre Antônio Xilo (Xilogravura) ---
  {
    id: 312, name: "Xilogravura - O Frevo", price: 220, stars: 4.9,
    category: "Xilogravura & Cordel", technique: "Xilogravura em umburana",
    artisanId: "demo-artisan-3", location: "Bezerros / PE", image: IMG.xilo,
    description: "Impressão original tirada de matriz de umburana entalhada à mão, em papel de alta gramatura.",
    quantity: 18, active: true,
  },
  {
    id: 313, name: "Xilogravura - Cangaceiros", price: 240, stars: 4.7,
    category: "Xilogravura & Cordel", technique: "Xilogravura em umburana",
    artisanId: "demo-artisan-3", location: "Bezerros / PE", image: IMG.xilo,
    description: "Gravura em preto e branco inspirada nas histórias do cangaço, numerada e assinada.",
    quantity: 14, active: true,
  },
  {
    id: 314, name: "Cordel Ilustrado - Lendas do Sertão", price: 25, stars: 4.5,
    category: "Xilogravura & Cordel", technique: "Impressão tipográfica",
    artisanId: "demo-artisan-3", location: "Bezerros / PE", image: IMG.xilo,
    description: "Folheto de cordel com capa xilogravada e versos sobre as lendas do sertão.",
    quantity: 100, active: true,
  },
  {
    id: 315, name: "Matriz de Xilogravura Original", price: 700, stars: 4.8,
    category: "Xilogravura & Cordel", technique: "Entalhe em madeira",
    artisanId: "demo-artisan-3", location: "Bezerros / PE", image: IMG.madeira,
    description: "Matriz em madeira entalhada à mão, peça de colecionador.",
    quantity: 2, active: true,
  },
  {
    id: 316, name: "Kit de Cartões Xilogravados (Esgotado)", price: 60, stars: 4.3,
    category: "Xilogravura & Cordel", technique: "Xilogravura em umburana",
    artisanId: "demo-artisan-3", location: "Bezerros / PE", image: IMG.xilo,
    description: "Dez cartões com gravuras originais e envelopes de papel reciclado.",
    quantity: 0, active: true,
  },

  // --- Mestre Chico Carranqueiro (Madeira) ---
  {
    id: 317, name: "Carranca Protetora em Cedro", price: 620, stars: 4.7,
    category: "Madeira & Entalhe", technique: "Entalhe em cedro",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.madeira,
    description: "Escultura entalhada em bloco único de cedro, com acabamento em cera natural.",
    quantity: 4, active: true,
  },
  {
    id: 318, name: "Carranca Pequena de Mesa", price: 280, stars: 4.4,
    category: "Madeira & Entalhe", technique: "Entalhe em cedro",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.madeira,
    description: "Versão compacta da carranca do São Francisco, ideal para decoração.",
    quantity: 11, active: true,
  },
  {
    id: 319, name: "Máscara de Caboclo de Lança", price: 340, stars: 4.6,
    category: "Máscaras & Carnaval", technique: "Papel machê",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.mascara,
    description: "Máscara em papel machê com pintura artesanal, inspirada no maracatu rural.",
    quantity: 9, active: true,
  },
  {
    id: 320, name: "Boneco de Olinda em Madeira", price: 190, stars: 4.5,
    category: "Madeira & Entalhe", technique: "Entalhe e pintura",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.mascara,
    description: "Boneco articulado em madeira leve, pintado à mão nas cores do carnaval pernambucano.",
    quantity: 16, active: true,
  },
  {
    id: 321, name: "Tábua de Corte em Madeira Nobre", price: 130, stars: 4.2,
    category: "Madeira & Entalhe", technique: "Marcenaria artesanal",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.madeira,
    description: "Tábua de corte em madeira de reflorestamento, acabada com óleo mineral.",
    quantity: 30, active: true,
  },
  {
    id: 322, name: "Cavalo-Marinho em Miniatura", price: 160, stars: 4.6,
    category: "Máscaras & Carnaval", technique: "Entalhe e pintura",
    artisanId: "demo-artisan-4", location: "Petrolina / PE", image: IMG.mascara,
    description: "Miniatura do cavalo-marinho, personagem do folguedo da Zona da Mata.",
    quantity: 13, active: true,
  },

  // --- Mestra Lourdes do Fuxico (conta desativada) ---
  {
    id: 323, name: "Manta de Fuxico", price: 350, stars: 4.5,
    category: "Rendas & Têxtil", technique: "Fuxico",
    artisanId: "demo-artisan-5", location: "Olinda / PE", image: IMG.textil2,
    description: "Manta feita com centenas de fuxicos de tecidos reaproveitados.",
    quantity: 5, active: true, // não deve aparecer: artesã desativada
  },
  {
    id: 324, name: "Bolsa de Retalhos", price: 110, stars: 4.1,
    category: "Rendas & Têxtil", technique: "Patchwork",
    artisanId: "demo-artisan-5", location: "Olinda / PE", image: IMG.textil1,
    description: "Bolsa em patchwork de retalhos de algodão com forro e zíper.",
    quantity: 9, active: true, // não deve aparecer: artesã desativada
  },
];

const productById = new Map(products.map((p) => [p.id, p]));

/* ------------------------------------------------------------------ */
/* Pedidos, avaliações e carrinho                                      */
/* ------------------------------------------------------------------ */

type DemoOrder = {
  id: string;
  userId: string;
  status: OrderStatus;
  createdAt: Date;
  items: { productId: number; quantity: number }[];
};

const orders: DemoOrder[] = [
  {
    id: "700001", userId: "demo-client-1", status: OrderStatus.delivered,
    createdAt: new Date("2026-09-05T12:00:00Z"),
    items: [{ productId: 301, quantity: 2 }, { productId: 307, quantity: 1 }],
  },
  {
    id: "700002", userId: "demo-client-2", status: OrderStatus.shipped,
    createdAt: new Date("2026-10-12T15:30:00Z"),
    items: [{ productId: 312, quantity: 1 }, { productId: 317, quantity: 1 }],
  },
  {
    id: "700003", userId: "demo-client-3", status: OrderStatus.processing,
    createdAt: new Date("2026-10-28T09:45:00Z"),
    items: [{ productId: 302, quantity: 1 }],
  },
  {
    id: "700004", userId: "demo-client-1", status: OrderStatus.paid,
    createdAt: new Date("2026-11-10T18:20:00Z"),
    items: [{ productId: 318, quantity: 1 }, { productId: 303, quantity: 3 }],
  },
  {
    id: "700005", userId: "demo-client-2", status: OrderStatus.pending,
    createdAt: new Date("2026-11-18T11:05:00Z"),
    items: [{ productId: 308, quantity: 1 }],
  },
  {
    id: "700006", userId: "demo-client-3", status: OrderStatus.cancelled,
    createdAt: new Date("2026-11-02T08:10:00Z"),
    items: [{ productId: 319, quantity: 1 }],
  },
];

// Avaliações só em pedidos aprovados (paid, processing, shipped ou delivered).
const reviews = [
  { id: "demo-review-1", userId: "demo-client-1", productId: 301, orderId: "700001", rating: 5, comment: "Peça belíssima, cheia de detalhes. Chegou muito bem embalada." },
  { id: "demo-review-2", userId: "demo-client-1", productId: 307, orderId: "700001", rating: 4, comment: "Renda delicada e de ótimo acabamento. Valeu cada centavo." },
  { id: "demo-review-3", userId: "demo-client-2", productId: 312, orderId: "700002", rating: 5, comment: "A gravura é linda e o papel é de excelente qualidade." },
  { id: "demo-review-4", userId: "demo-client-2", productId: 317, orderId: "700002", rating: 4, comment: "Carranca imponente. Só demorou um pouco a chegar." },
  { id: "demo-review-5", userId: "demo-client-3", productId: 302, orderId: "700003", rating: 5, comment: "Cada figurinha tem uma expressão diferente. Adorei!" },
  { id: "demo-review-6", userId: "demo-client-1", productId: 318, orderId: "700004", rating: 3, comment: "Bonita, mas é menor do que eu imaginava." },
];

// Carrinho persistido do comprador 3 (usado por /cart e por /purchases/finalize sem itens).
const cart = {
  id: "demo-cart-3",
  userId: "demo-client-3",
  items: [
    { id: "demo-cart-3-1", productId: 312, quantity: 2 },
    { id: "demo-cart-3-2", productId: 309, quantity: 1 },
  ],
};

/* ------------------------------------------------------------------ */
/* Execução                                                            */
/* ------------------------------------------------------------------ */

function averageStars(productId: number, fallback: number): number {
  const ratings = reviews.filter((r) => r.productId === productId).map((r) => r.rating);

  if (ratings.length === 0) {
    return fallback;
  }

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(average * 10) / 10;
}

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { ...user, password },
      create: { ...user, password },
    });
  }

  for (const product of products) {
    const artisan = artisanById.get(product.artisanId)!;
    const { id, ...rest } = product;
    const data = {
      ...rest,
      artisan: artisan.name,
      stars: averageStars(id, product.stars),
    };

    await prisma.product.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  for (const order of orders) {
    const items = order.items.map((item, index) => {
      const product = productById.get(item.productId)!;

      return {
        id: `${order.id}-${index + 1}`,
        productId: product.id,
        artisanId: product.artisanId,
        quantity: item.quantity,
        unitPrice: product.price,
        packed: order.status === OrderStatus.shipped || order.status === OrderStatus.delivered,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const buyer = users.find((u) => u.id === order.userId)!;
    const orderData = {
      userId: order.userId,
      customerName: buyer.name,
      customerEmail: buyer.email,
      status: order.status,
      totalAmount,
      createdAt: order.createdAt,
    };

    await prisma.order.upsert({
      where: { id: order.id },
      update: orderData,
      create: { id: order.id, ...orderData },
    });

    for (const item of items) {
      const { id, ...itemData } = item;

      await prisma.orderItem.upsert({
        where: { id },
        update: itemData,
        create: { id, orderId: order.id, ...itemData },
      });
    }
  }

  for (const review of reviews) {
    const { id, ...reviewData } = review;

    await prisma.review.upsert({
      where: { id },
      update: reviewData,
      create: { id, ...reviewData },
    });
  }

  await prisma.cart.upsert({
    where: { id: cart.id },
    update: { userId: cart.userId },
    create: { id: cart.id, userId: cart.userId },
  });

  for (const item of cart.items) {
    await prisma.cartItem.upsert({
      where: { id: item.id },
      update: { productId: item.productId, quantity: item.quantity },
      create: { id: item.id, cartId: cart.id, productId: item.productId, quantity: item.quantity },
    });
  }

  // Os produtos foram inseridos com ids explícitos; sem isto, a sequência do
  // autoincrement continua atrás e um POST /products posterior falha por id duplicado.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT COALESCE(MAX(id), 1) FROM products))`
  );

  console.log("Seed de demonstração concluída.");
  console.log(`  Usuários: ${users.length} | Produtos: ${products.length} | Pedidos: ${orders.length} | Avaliações: ${reviews.length}`);
  console.log(`  Senha de todos os usuários: ${DEMO_PASSWORD}`);
  console.log("  client : camila@demo.manoa.com.br (carrinho vazio) | juliana@demo.manoa.com.br (com carrinho)");
  console.log("  artisan: ze.barro@demo.manoa.com.br");
  console.log("  admin  : admin@demo.manoa.com.br");
  console.log("  inativo: lourdes.fuxico@demo.manoa.com.br (login deve falhar)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });