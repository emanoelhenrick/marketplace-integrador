import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";

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
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col bg-background">
        <NavBar />
        <div className="flex-1 px-20 py-10">{children}</div>
      </body>
    </html>
  );
}
