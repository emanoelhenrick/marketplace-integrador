"use client";

import { useRouter } from "next/navigation";

import { RoleGuard } from "@/components/auth/role-guard";
import { AccountInfoGrid } from "@/components/profile/account-info-grid";
import { ArtisanOverviewCard } from "@/components/profile/artisan-overview-card";
import { ArtisanProfileForm } from "@/components/profile/artisan-profile-form";
import { MyProducts } from "@/components/profile/my-products";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useMyProducts } from "@/hooks/use-my-products";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useSession } from "@/hooks/use-session";
import { ACCESS, allowRoles } from "@/lib/permissions";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/authStore";

function ProfileContent() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, isArtisan } = useSession();
  const { artisan, setArtisan } = useMyProfile();
  const mine = useMyProducts(isArtisan);

  if (!user) return null;

  const completeUser = artisan ? { ...artisan, ...user } : user;

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Você saiu da sua conta", { description: "Até a próxima!" });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-8">
      <ProfileHeader
        user={completeUser}
        artisan={artisan}
        onLogout={handleLogout}
      />

      <AccountInfoGrid user={completeUser} />

      {isArtisan && artisan && (
        <>
          <ArtisanOverviewCard artisan={artisan} />
          <ArtisanProfileForm
            key={String(artisan.bio)}
            artisan={artisan}
            onSaved={setArtisan}
          />
        </>
      )}

      {isArtisan && (
        <MyProducts products={mine.products} isLoading={mine.isLoading} />
      )}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <RoleGuard
      allow={allowRoles(ACCESS.anyUser)}
      loginTitle="Você ainda não entrou na sua conta"
      loginDescription="Entre com seu e-mail e senha para ver seu perfil."
    >
      <ProfileContent />
    </RoleGuard>
  );
}