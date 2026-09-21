/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "@base-ui/react";
import { CircleUserRound, Moon, ShoppingBag } from "lucide-react";

export default function NavBar() {
  const stylesHoverLink = "relative text-carvao/80 hover:text-(--urucum) transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-(--urucum) hover:after:w-full after:transition-all after:duration-300";

  return (
    <nav className="py-5 px-20 border-b flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <img
            src="/assets/logo.png"
            alt="Manoa Logo"
            className="h-10 w-auto"
          />
        </Link>

        <button
          type="button"
          aria-label="Alternar tema"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Moon className="w-5 h-5 text-carvao" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/products"
            className={stylesHoverLink}
          >
            Produtos
          </Link>
          <Link
            href="/mestres"
            className={stylesHoverLink}
          >
            Mestres e Histórias
          </Link>
          <Link
            href="/polos"
            className={stylesHoverLink}
          >
            Polos Criativos
          </Link>
        </nav>

        <Button className="bg-(--barro-claro) text-carvao font-medium px-10 py-2 flex items-center gap-2 rounded-md cursor-pointer hover:bg-(--sol) hover:scale-105 active:scale-95 transition-all duration-200">
          <ShoppingBag className="w-5 h-5" />
          <span>Carrinho</span>
        </Button>

        <Link
          href="/perfil"
          aria-label="Perfil do usuário"
          className="p-1 rounded-full hover:bg-(--barro-claro)/50 transition-colors"
        >
          <CircleUserRound className="w-7 h-7 text-(--urucum)" />
        </Link>
      </div>
    </nav>
  );
}
