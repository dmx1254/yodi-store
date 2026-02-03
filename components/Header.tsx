"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
const Header = () => {
  const pathname = usePathname();

  return pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password") ? null : (
    <header className="bg-[#A36F5E] z-30 sticky top-0 right-0 left-0 w-full px-4 py-2 md:py-1 flex md:flex-row flex-col items-center md:justify-around justify-center md:gap-4 gap-2">
      <div>
        <p className="text-base md:text-sm text-white">
          LIVRAISON EN MOINS DE 24H À DAKAR
          <br />
          sauf les dimanches et jours fériés !!
        </p>
      </div>
      <div className="flex items-center gap-2 w-full md:max-w-1/3 bg-white">
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full p-3 text-sm text-black outline-none focus:outline-none"
        />
        <button className="bg-gray-300 flex items-center justify-center py-3 px-2 text-black">
          <Search className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 w-full max-w-1/8 invisible max-md:hidden">
        <div className="flex items-center gap-2">
          <p>Mon compte</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
