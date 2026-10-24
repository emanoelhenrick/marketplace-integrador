"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RoleGuard } from "@/components/auth/role-guard";
import { MyProducts } from "@/components/profile/my-products";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useSession } from "@/hooks/use-session";
import { toast } from "@/lib/toast";
import { productService } from "@/services/productService";
import { artesiansService } from "@/services/artisansService";
import { useAuthStore } from "@/store/authStore";
import type { Artisan } from "@/types/artisan";
import type { Product } from "@/types/product";

function ProfileContent() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, isArtisan } = useSession();

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (userId === undefined || !isArtisan) return;
    let isMounted = true;

    async function load() {
      try {
        setIsLoadingProducts(true);
        const [products, artisanData] = await Promise.all([
          productService.getByArtisan(userId!),
          artesiansService.getById(userId!).catch(() => null),
        ]);
        if (!isMounted) return;
        setMyProducts(products);
        setArtisan(artisanData);
      } catch (error) {
        console.error("Erro ao carregar seus produtos:", error);
        toast.error("Não foi possível carregar seus produtos");
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [userId, isArtisan]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Você saiu da sua conta", { description: "Até a próxima!" });
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-8 sm:space-y-10">
      <ProfileHeader user={user} artisan={artisan} onLogout={handleLogout} />
      {isArtisan && <MyProducts products={myProducts} isLoading={isLoadingProducts} />}
    </main>
  );
}

export default function PerfilPage() {
  return (
    <RoleGuard
      allow={["client", "artisan", "admin"]}
      loginTitle="Você ainda não entrou na sua conta"
      loginDescription="Entre com seu e-mail e senha para ver seu perfil."
    >
      <ProfileContent />
    </RoleGuard>
  );
}
