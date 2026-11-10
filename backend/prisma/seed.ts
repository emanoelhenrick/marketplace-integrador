import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    role: UserRole.client,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    phone: "(81) 98888-1111",
    createdAt: new Date("2026-01-15T10:30:00Z"),
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    role: UserRole.client,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    phone: "(81) 99777-2222",
    createdAt: new Date("2026-02-01T14:20:00Z"),
  },
  {
    id: "3",
    name: "Carlos Eduardo Santos",
    email: "carlos.santos@email.com",
    role: UserRole.client,
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    phone: "(81) 99666-3333",
    createdAt: new Date("2026-02-10T11:15:00Z"),
  },
  {
    id: "4",
    name: "Ana Beatriz Lima",
    email: "ana.lima@email.com",
    role: UserRole.client,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    phone: "(81) 99555-4444",
    createdAt: new Date("2026-02-18T09:40:00Z"),
  },
  {
    id: "5",
    name: "Fernando Mendonça",
    email: "fernando.mendonca@email.com",
    role: UserRole.client,
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
    phone: "(81) 99444-5555",
    createdAt: new Date("2026-03-01T16:05:00Z"),
  },
  {
    id: "101",
    name: "Mestre Manuel Eudócio",
    email: "eudocio@barro.com.br",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    phone: "(81) 99111-3333",
    createdAt: new Date("2025-11-10T08:00:00Z"),
    craft: "Cerâmica & Barro",
    craftYears: "45 anos de ofício",
    quote: "Moldar o barro é dar forma à história do nosso sertão.",
    location: "Alto do Moura, Caruaru - PE",
    polo: "Polo Mestre Vitalino",
    region: "Agreste",
    totalWorks: 48,
  },
  {
    id: "102",
    name: "Dona Maria das Rendas",
    email: "maria.renascenca@email.com",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    phone: "(81) 99222-4444",
    createdAt: new Date("2025-12-01T09:15:00Z"),
    craft: "Rendas & Bordados",
    craftYears: "30 anos de tradição",
    quote: "Cada ponto da renda Renascença guarda a paciência e o amor da rendeira.",
    location: "Poção - PE",
    polo: "Polo das Rendeiras",
    region: "Agreste",
    totalWorks: 32,
  },
  {
    id: "103",
    name: "Mestre J. Borges",
    email: "ateliere@jborges.com.br",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    phone: "(81) 99333-5555",
    createdAt: new Date("2025-10-05T11:00:00Z"),
    craft: "Xilogravura & Cordel",
    craftYears: "50 anos de poesia",
    quote: "A madeira entalhada conta a poesia do povo nordestino.",
    location: "Bezerros - PE",
    polo: "Polo Gravatá e Bezerros",
    region: "Agreste",
    totalWorks: 85,
  },
  {
    id: "104",
    name: "Mestre Saôba",
    email: "saoba.madeira@email.com",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    phone: "(81) 99444-6666",
    createdAt: new Date("2025-09-12T14:30:00Z"),
    craft: "Escultura em Madeira",
    craftYears: "38 anos de arte",
    quote: "As formas sagradas e os papangus já estão escondidos na madeira, eu só tiro o excesso.",
    location: "Olinda - PE",
    polo: "Polo de Olinda e Recife",
    region: "Metropolitana",
    totalWorks: 29,
  },
  {
    id: "105",
    name: "Dona Maria de Nuca",
    email: "nuca.tracunhaem@email.com",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604",
    phone: "(81) 99555-7777",
    createdAt: new Date("2025-08-20T10:00:00Z"),
    craft: "Cerâmica & Barro",
    craftYears: "40 anos de barro",
    quote: "O leão de Tracunhaém com seus caracóis de barro é o guardião da nossa cultura.",
    location: "Tracunhaém - PE",
    polo: "Polo Zona da Mata Norte",
    region: "Zona da Mata",
    totalWorks: 54,
  },
  {
    id: "106",
    name: "Mestre Zé Alves",
    email: "zealves.couro@email.com",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    phone: "(87) 99666-8888",
    createdAt: new Date("2025-07-15T16:20:00Z"),
    craft: "Arte em Couro",
    craftYears: "28 anos de vaquejada",
    quote: "O couro costurado à mão veste a resistência do sertanejo.",
    location: "Salgueiro - PE",
    polo: "Polo Central do Sertão",
    region: "Sertão",
    totalWorks: 21,
  },
  {
    id: "107",
    name: "Mestre Nicola",
    email: "nicola.petrolina@email.com",
    role: UserRole.artisan,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    phone: "(87) 99777-9999",
    createdAt: new Date("2025-06-01T08:45:00Z"),
    craft: "Escultura em Madeira",
    craftYears: "35 anos de Velho Chico",
    quote: "Minhas carrancas protegem as águas do São Francisco e a alma dos ribeirinhos.",
    location: "Petrolina - PE",
    polo: "Polo Vale do São Francisco",
    region: "Sertão",
    totalWorks: 40,
  },
  {
    id: "900",
    name: "Administração Manoa",
    email: "admin@manoa.com.br",
    role: UserRole.admin,
    phone: "(81) 3000-0000",
    createdAt: new Date("2025-09-01T08:00:00Z"),
  },
];

const products = [
  {
    id: 1,
    name: "Casal de Noivos de Barro",
    price: 180,
    stars: 4.8,
    category: "Cerâmica & Barro",
    artisan: "Mestre Vitalino (Família)",
    location: "Alto do Moura / Caruaru",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    description: "Modelagem figurativa em argila queimada a lenha, retratando o cotidiano e as tradições do agreste pernambucano.",
  },
  {
    id: 2,
    name: "Toalha em Renda Renascença",
    price: 450,
    stars: 5,
    category: "Rendas & Bordados",
    artisan: "Associação de Rendeiras",
    location: "Poção / PE",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
    description: "Trama milimétrica confeccionada manualmente em almofada de bilro com fios de algodão puro.",
  },
  {
    id: 3,
    name: "Matriz de Xilogravura - O Frevo",
    price: 220,
    stars: 4.9,
    category: "Xilogravura & Cordel",
    artisan: "Mestre J. Borges",
    location: "Bezerros / PE",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    description: "Impressão original tirada de matriz de umburana entalhada à mão com pigmento preto em papel de gramatura especial.",
  },
  {
    id: 4,
    name: "Carranca Protetora em Cedro",
    price: 620,
    stars: 4.7,
    category: "Madeira & Entalhe",
    artisan: "Mestre Saúba",
    location: "Jaboatão dos Guararapes / PE",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    description: "Escultura folclórica entalhada em bloco único de madeira nobre restaurada com acabamento em cera natural.",
  },
  {
    id: 5,
    name: "Santo Antônio de Barro Pintado",
    price: 140,
    stars: 4.5,
    category: "Cerâmica & Barro",
    artisan: "Mestra Ana das Carrancas",
    location: "Petrolina / PE",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80",
    description: "Arte sacra popular moldada à mão com traços marcantes e olhos vazados, marca registrada do São Francisco.",
  },
  {
    id: 6,
    name: "Máscara de Papangú de Bezerros",
    price: 110,
    stars: 4.3,
    category: "Máscaras & Carnaval",
    artisan: "Ateliê Papangú",
    location: "Bezerros / PE",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    description: "Máscara tradicional de papel machê e tinta acrílica feita para o carnaval do Agreste pernambucano.",
  },
  {
    id: 7,
    name: "Colcha em Patchwork & Fuxico",
    price: 380,
    stars: 4.6,
    category: "Rendas & Têxtil",
    artisan: "Coletivo Rendeiras de Passira",
    location: "Passira / PE",
    image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80",
    description: "Trabalho manual de reaproveitamento de retalhos coloridos unindo centenas de fuxicos em padrões florais.",
  },
  {
    id: 8,
    name: "Ex-Voto de Madeira Entalhada",
    price: 195,
    stars: 4.4,
    category: "Madeira & Entalhe",
    artisan: "Mestre Nena",
    location: "Tracunhaém / PE",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    description: "Peça devocional esculpida em umburana representando o agradecimento a promessas e fé popular.",
  },
  {
    id: 9,
    name: "Vaso Utilitário em Argila Vermelha",
    price: 160,
    stars: 5,
    category: "Cerâmica & Barro",
    artisan: "Mestre Manuel Eudócio",
    location: "Caruaru",
    image: null,
    description: null,
  },
  ...[
    [201, "Produto do pedido 1001", 180, "Cerâmica & Barro", "Mestre Manuel Eudócio", "Alto do Moura, Caruaru - PE"],
    [207, "Produto do pedido 1001", 150, "Xilogravura & Cordel", "Mestre J. Borges", "Bezerros - PE"],
    [204, "Produto do pedido 1002", 450, "Rendas & Bordados", "Dona Maria das Rendas", "Poção - PE"],
    [212, "Produto do pedido 1003", 580, "Cerâmica & Barro", "Dona Maria de Nuca", "Tracunhaém - PE"],
    [210, "Produto do pedido 1003", 260, "Escultura em Madeira", "Mestre Saôba", "Olinda - PE"],
    [214, "Produto do pedido 1003", 210, "Arte em Couro", "Mestre Zé Alves", "Salgueiro - PE"],
    [216, "Produto do pedido 1004", 640, "Escultura em Madeira", "Mestre Nicola", "Petrolina - PE"],
    [208, "Produto do pedido 1004", 180, "Xilogravura & Cordel", "Mestre J. Borges", "Bezerros - PE"],
    [215, "Produto do pedido 1005", 750, "Arte em Couro", "Mestre Zé Alves", "Salgueiro - PE"],
  ].map(([id, name, price, category, artisan, location]) => ({
    id: id as number,
    name: name as string,
    price: price as number,
    stars: 0,
    category: category as string,
    artisan: artisan as string,
    location: location as string,
    image: null,
    description: null,
  })),
];

const orders = [
  {
    id: "1001",
    userId: "1",
    customerName: "João Silva",
    customerEmail: "joao.silva@email.com",
    status: OrderStatus.paid,
    totalAmount: 330,
    createdAt: new Date("2026-03-20T14:00:00Z"),
    items: [
      { productId: 201, artisanId: "101", quantity: 1, unitPrice: 180, packed: true },
      { productId: 207, artisanId: "103", quantity: 1, unitPrice: 150, packed: false },
    ],
  },
  {
    id: "1002",
    userId: "2",
    customerName: "Maria Oliveira",
    customerEmail: "maria.oliveira@email.com",
    status: OrderStatus.shipped,
    totalAmount: 450,
    createdAt: new Date("2026-03-22T16:45:00Z"),
    items: [{ productId: 204, artisanId: "102", quantity: 1, unitPrice: 450, packed: false }],
  },
  {
    id: "1003",
    userId: "3",
    customerName: "Carlos Eduardo Santos",
    customerEmail: "carlos.santos@email.com",
    status: OrderStatus.delivered,
    totalAmount: 1050,
    createdAt: new Date("2026-03-15T10:20:00Z"),
    items: [
      { productId: 212, artisanId: "105", quantity: 1, unitPrice: 580, packed: false },
      { productId: 210, artisanId: "104", quantity: 1, unitPrice: 260, packed: false },
      { productId: 214, artisanId: "106", quantity: 1, unitPrice: 210, packed: false },
    ],
  },
  {
    id: "1004",
    userId: "4",
    customerName: "Ana Beatriz Lima",
    customerEmail: "ana.lima@email.com",
    status: OrderStatus.paid,
    totalAmount: 820,
    createdAt: new Date("2026-03-23T11:10:00Z"),
    items: [
      { productId: 216, artisanId: "107", quantity: 1, unitPrice: 640, packed: false },
      { productId: 208, artisanId: "103", quantity: 1, unitPrice: 180, packed: false },
    ],
  },
  {
    id: "1005",
    userId: "5",
    customerName: "Fernando Mendonça",
    customerEmail: "fernando.mendonca@email.com",
    status: OrderStatus.pending,
    totalAmount: 750,
    createdAt: new Date("2026-03-25T08:30:00Z"),
    items: [{ productId: 215, artisanId: "106", quantity: 1, unitPrice: 750, packed: false }],
  },
];

async function main() {
  const password = await bcrypt.hash("123456", 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        ...user,
        password,
      },
      create: {
        ...user,
        password,
      },
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
      create: {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });

    for (const [index, item] of order.items.entries()) {
      const itemId = `${order.id}-${index + 1}`;

      await prisma.orderItem.upsert({
        where: { id: itemId },
        update: item,
        create: {
          id: itemId,
          orderId: order.id,
          ...item,
        },
      });
    }
  }
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