"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/sampledata";
import useStore from "@/lib/store-manage";
import SheetMenu from "./SheetMenu";
import { usePathname } from "next/navigation";

const Hero = () => {
  const pathname = usePathname();
  const { carts, totalQuantity } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectId = (id: string) => {
    setSelectedId(id);
  };

  const subTotal = carts.reduce(
    (acc, cart) =>
      acc +
      (cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0)) *
        cart.quantity,
    0
  );

  return pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password") ? null : (
    <div className="flex flex-col items-center gap-4 p-6 md:p-4 w-full max-w-6xl mx-auto">
      {/* Logo avec animation d'entrée - gardé de la version améliorée */}

      <div className="w-full flex items-center justify-between">
        <SheetMenu />
        <div className="mb-0 transform hover:scale-105 transition-all duration-500">
          <Link href="/" className="relative">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="object-cover drop-shadow-2xl"
            />
            {/* Glow effect autour du logo - gardé de la version améliorée */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-amber-300/20 rounded-full blur-xl -z-10 animate-pulse"></div>
          </Link>
        </div>

        <Link
          href="/panier"
          className="relative bg-[#A36F5E] cursor-pointer text-white rounded-full p-3 transition-all duration-300 hover:scale-110 hover:bg-[#916253]"
          onMouseEnter={() => setIsShowCart(true)}
        >
          <ShoppingCart className="w-5 h-5 text-black" />
          {totalQuantity > 0 && (
            <span className="absolute -top-3 -right-3 p-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {totalQuantity}
            </span>
          )}
        </Link>
        {isShowCart && (
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
            className="absolute right-[15%] top-[38%] z-40 font-josefin transform -translate-y-1/2 bg-white w-full flex flex-col items-start max-w-80 rounded-lg p-4"
            onMouseLeave={() => setIsShowCart(false)}
          >
            {carts.length < 1 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xs">Votre panier est vide</h2>
              </div>
            ) : (
              <>
                {carts.map((cart) => (
                  <div
                    key={cart.id}
                    className="flex items-start justify-between gap-4 pb-4"
                    style={{
                      borderBottom: "1px solid #E0E0E0",
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <h2 className="text-xs">{cart.title}</h2>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[#A36F5E]">
                          {cart.quantity} *{" "}
                          {cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)}{" "}
                          FCFA
                        </p>
                        <p className="text-xs text-[#A36F5E] line-through">
                          {cart.price} FCFA
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src={cart.imageUrl}
                        alt={cart.title}
                        width={200}
                        height={200}
                        className="w-20 h-16 object-cover"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center my-2 gap-2">
                  <h2 className="text-xs">SOUS TOTAL:</h2>
                  <p className="text-xs text-[#A36F5E]">
                    {Math.round(subTotal)} FCFA
                  </p>
                </div>

                <div className="w-full flex items-center justify-between gap-4 lg:gap-8 flex-end mt-6">
                  <Link
                    href="/panier"
                    className="border w-1/2 text-center border-[#A36F5E] rounded-full  hover:bg-[#A36F5E] hover:text-white cursor-pointer text-[#A36F5E] p-2 text-sm font-bold transition-all duration-300"
                  >
                    Voir le panier
                  </Link>
                  <Link
                    href="/checkout"
                    className="border w-1/2 text-center border-[#A36F5E] hover:bg-[#A36F5E] hover:text-white cursor-pointer text-[#A36F5E] p-2 text-sm font-bold rounded-full transition-all duration-300"
                  >
                    Commander
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="md:flex hidden items-center gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onMouseEnter={() => {
              handleSelectId(category.id);
              setIsOpen(true);
            }}
            onMouseLeave={() => {
              setIsOpen(false);
              setSelectedId(null);
            }}
            className="relative text-black/80 cursor-pointer transition-all duration-300 hover:text-white hover:bg-[#A36F5E] p-4"
          >
            <Link href={`/${category.slug}`}>{category.title}</Link>

            {isOpen && selectedId === category.id && category.subcategories && (
              <div className="bg-white min-w-[200px] z-50 flex flex-col gap-2 absolute top-14 left-0 p-4">
                {category.subcategories?.map((subcategory, index) => (
                  <Link
                    href={`/${category.slug}/${subcategory.slug}`}
                    key={`${subcategory.id}-${index}`}
                    className="text-black/80 cursor-pointer transition-all duration-300 hover:text-[#A36F5E] p-2"
                  >
                    {subcategory.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
