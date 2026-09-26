/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  Star,
  Printer,
  CheckCircle2,
  Plus,
  Eye,
  MessageCircle,
  HelpCircle,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Artisan } from "@/types/artisan";
import { Product } from "@/types/product";
import { Order } from "@/types/order";

import { artesiansService } from "@/services/artisansService";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArtisanDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const numericId = Number(id);

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);

        const [artisanData, allProducts, allOrders] = await Promise.all([
          artesiansService.getById(numericId),
          productService.getAll().catch(() => []),
          orderService.getAll().catch(() => []),
        ]);

        setArtisan(artisanData);

        const artisanProducts = allProducts.filter(
          (p) => p.artisanId === numericId,
        );
        setProducts(artisanProducts);

        const artisanOrders = allOrders.filter((order) =>
          order.items?.some((item) => item.artisanId === numericId),
        );
        setOrders(artisanOrders);
      } catch (error) {
        console.error("Erro ao carregar dados do ateliê:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadDashboardData();
  }, [id, numericId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="px-20 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">
          Artesão não encontrado.
        </h2>
        <Link
          href="/artesaos"
          className="text-(--barro) underline inline-block"
        >
          Voltar para a lista de artesãos
        </Link>
      </div>
    );
  }

  const totalRepasse = orders.reduce((acc, order) => {
    const itemsDoArtesao = order.items.filter(
      (item) => item.artisanId === numericId,
    );
    const subtotal = itemsDoArtesao.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    return acc + subtotal * 0.85;
  }, 0);

  const pendingItems = orders
    .filter((order) => order.status === "paid" || order.status === "pending")
    .flatMap((order) =>
      order.items
        .filter((item) => item.artisanId === numericId)
        .map((item) => ({
          ...item,
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          createdAt: order.createdAt,
          orderStatus: order.status,
        })),
    );

  const shippedOrdersCount = orders.filter(
    (o) => o.status === "shipped",
  ).length;

  return (
    <main className="px-8 md:px-16 lg:px-20 py-8 bg-[#FBF8F3] min-h-screen text-stone-800 space-y-10">
      <Link
        href="/artesaos"
        className="flex items-center gap-2 text-stone-600 hover:text-black text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a lista
      </Link>

      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-stone-200">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            {artisan.location || "Pernambuco, Brasil"}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            Bom dia, {artisan.name}
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Seu ateliê está ativo na salvaguarda cultural de {artisan.location}.
            Hoje temos{" "}
            <strong className="text-stone-900 font-semibold">
              {pendingItems.length} novos pedidos
            </strong>{" "}
            aguardando embalagem e envio com selo de autenticidade.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-sm border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition font-medium text-stone-700 flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-stone-500" /> Ver ateliê público
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm bg-[#C25838] hover:bg-[#a6482c] text-white rounded-md transition font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Cadastrar Nova Peça
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF3EA] border border-amber-200/60 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500 tracking-wider">
            <span>Repasse a Receber</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalRepasse)}
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Transferência via PIX programada para esta sexta-feira (18h) sem
            taxas.
          </p>
        </div>

        <div className="bg-[#FAF3EA] border border-amber-200/60 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500 tracking-wider">
            <span>Obras no Acervo</span>
            <Package className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {products.length}{" "}
            <span className="text-base font-normal text-stone-600">peças</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Esculturas disponíveis para colecionadores de todo o Brasil.
          </p>
        </div>

        <div className="bg-[#FAF3EA] border border-amber-200/60 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500 tracking-wider">
            <span>Viajando pelo País</span>
            <Truck className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900">
            {shippedOrdersCount}{" "}
            <span className="text-base font-normal text-stone-600">
              remessas
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Enviadas para São Paulo, Rio de Janeiro e Recife com livreto.
          </p>
        </div>

        <div className="bg-[#FAF3EA] border border-amber-200/60 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-stone-500 tracking-wider">
            <span>Avaliação Cultural</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900">
              5.0
            </span>
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed italic">
            &ldquo;{artisan.quote}&rdquo;
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-bold text-red-700 tracking-widest uppercase">
              • Atenção Imediata
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Pedidos aguardando preparo e embalagem
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            {pendingItems.length} encomendas precisam do seu carinho hoje
          </span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-500">
            Nenhum pedido pendente de embalagem no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingItems.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);

              const formattedDate = new Date(item.createdAt).toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <div
                  key={`${item.orderId}-${item.productId}-${index}`}
                  className="bg-[#FAF6F0] border border-stone-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        product?.image ||
                        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"
                      }
                      alt={product?.name || "Obra de Arte"}
                      className="w-20 h-20 object-cover rounded-md border border-stone-200 shrink-0 bg-stone-100"
                    />
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-red-800">
                          Pedido #{item.orderId}
                        </span>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formattedDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-900 text-base leading-snug">
                        {product?.name || `Produto #${item.productId}`}
                      </h3>
                      <p className="text-xs text-stone-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        Destino: {item.customerName} ({item.quantity}x -{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.unitPrice)}
                        )
                      </p>
                      <p className="text-xs text-stone-500 bg-amber-100/60 px-2 py-1 rounded mt-1 border border-amber-200/50">
                        Preparo: Embalar com a caixa reforçada e selo de
                        autenticidade da Manoa.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-stone-600 hover:text-black font-medium"
                    >
                      <Printer className="w-4 h-4 text-stone-500" /> Imprimir
                      Etiqueta
                    </button>
                    <button
                      type="button"
                      className="bg-[#C25838] hover:bg-[#a6482c] text-white px-4 py-2 rounded font-medium flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmar Embalado
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Tabela do Catálogo de Obras */}
      <section className="space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">
              • Gestão do Ateliê
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Obras Expostas no Catálogo
            </h2>
            <p className="text-xs text-stone-500">
              Veja quanto cada comprador paga e o valor líquido exato que cai na
              sua conta sem surpresas.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#C25838] hover:underline cursor-pointer">
            Ver acervo completo ({products.length}) &rarr;
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F3] border-b border-stone-200 text-[11px] uppercase font-semibold text-stone-500 tracking-wider">
              <tr>
                <th className="p-4">Obra & Técnica</th>
                <th className="p-4">Preço na Galeria</th>
                <th className="p-4">Seu Ganho Líquido (85%)</th>
                <th className="p-4">Unidades</th>
                <th className="p-4">Exibição</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-stone-400">
                    Nenhuma obra cadastrada para este artesão.
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const ganhoLiquido = item.price * 0.85;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-stone-50/50 transition"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {item.category}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-stone-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </td>
                      <td className="p-4 font-bold text-emerald-700">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(ganhoLiquido)}
                      </td>
                      <td className="p-4 text-stone-600">1 peça única</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          • Visível
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          className="p-1.5 text-stone-400 hover:text-stone-800 transition"
                          title="Editar Peça"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suporte e Dicas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-[#FAF6F0] border border-stone-200 rounded-lg p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-stone-300">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
              alt="Curadora"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Sua Curadora Regional
              </span>
              <h4 className="font-bold text-stone-900 text-base">
                Precisa de ajuda com fotos ou medidas?
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Clara Peixoto está à disposição para tirar dúvidas sobre
                cadastro de peças ou medidas de argila.
              </p>
            </div>
            <button
              type="button"
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-4 py-2 rounded font-medium flex items-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp com Clara
            </button>
          </div>
        </div>

        <div className="bg-[#FAF6F0] border border-stone-200 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-amber-700" /> Dica do Mês para
            Mestres
          </div>
          <h4 className="font-bold text-stone-900 text-base">
            Como valorizar sua assinatura no barro
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Colecionadores valorizam ver o momento em que a peça é assinada à
            ponta de faca ou estilete. Ao cadastrar, tire uma foto em close-up
            do fundo da peça.
          </p>
          <a
            href="#guia"
            className="text-xs font-semibold text-[#C25838] hover:underline inline-block pt-1"
          >
            Ver exemplo no guia do ateliê &rarr;
          </a>
        </div>
      </section>
    </main>
  );
}
