import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";
import { ThemeScript } from "@/components/theme/theme-script";
import { Toaster } from "@/components/ui/toaster";
import { CartHydrator } from "@/components/cart/cart-hydrator";

export const metadata: Metadata = {
  title: "Manoa",
  description: "Artesanato Pernambucano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NavBar />
        <div className="flex-1 py-6 sm:py-10">{children}</div>
        <Toaster />
        <CartHydrator />
      </body>
    </html>
  );
}
