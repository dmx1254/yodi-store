"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, DollarSign, ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/sampledata";
import useStore from "@/lib/store-manage";
import SheetMenu from "./SheetMenu";
import { usePathname } from "next/navigation";

const Hero = () => {
  const pathname = usePathname();
  const {
    carts,
    totalQuantity,
    selectedCurrency,
    usdRate,
    setSelectedCurrency,
    setUsdRate,
  } = useStore();
  // usdRate est stocké dans le store pour être utilisé ailleurs dans l'application pour la conversion des prix
  const [isOpen, setIsOpen] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // console.log(usdRate);
  // console.log(selectedCurrency);

  // Récupérer le taux de change USD au chargement
  useEffect(() => {
    const fetchCurrencyRate = async () => {
      try {
        const response = await fetch("/api/currency", {
          cache: "force-cache",
          next: {
            revalidate: 60 * 60 * 1, // 1 heure
          },
        });
        const data = await response.json();
        // console.log("data", data);
        if (data && data.rate) {
          setUsdRate(data.rate);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du taux de change:",
          error
        );
      }
    };
    fetchCurrencyRate();
  }, [setUsdRate]);

  // Fermer le menu de devise en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".currency-selector")) {
        setIsCurrencyOpen(false);
      }
    };

    if (isCurrencyOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCurrencyOpen]);

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

        <div className="flex items-center gap-3">
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

          {/* Sélecteur de devise moderne */}
          <div className="relative currency-selector">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="group relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 cursor-pointer text-gray-700 rounded-full px-3 py-2.5 transition-all duration-300 hover:bg-white hover:border-[#A36F5E] hover:shadow-md text-sm font-medium"
            >
              <Globe className="w-4 h-4 text-[#A36F5E] transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">{selectedCurrency}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  isCurrencyOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-50 min-w-[160px] border border-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setSelectedCurrency("XOF");
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                    selectedCurrency === "XOF"
                      ? "bg-[#A36F5E] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      selectedCurrency === "XOF"
                        ? "bg-white/20"
                        : "bg-[#A36F5E]/10"
                    }`}
                  >
                    <span className="text-xs font-bold">F</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">XOF</span>
                    <span
                      className={`text-xs ${selectedCurrency === "XOF" ? "text-white/80" : "text-gray-500"}`}
                    >
                      FCFA
                    </span>
                  </div>
                  {selectedCurrency === "XOF" && (
                    <div className="ml-auto">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                <div className="h-px bg-gray-200"></div>

                <button
                  onClick={() => {
                    setSelectedCurrency("USD");
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                    selectedCurrency === "USD"
                      ? "bg-[#A36F5E] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      selectedCurrency === "USD"
                        ? "bg-white/20"
                        : "bg-[#A36F5E]/10"
                    }`}
                  >
                    <DollarSign
                      className={`w-4 h-4 ${selectedCurrency === "USD" ? "text-white" : "text-[#A36F5E]"}`}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">USD</span>
                    <span
                      className={`text-xs ${selectedCurrency === "USD" ? "text-white/80" : "text-gray-500"}`}
                    >
                      Dollar
                    </span>
                  </div>
                  {selectedCurrency === "USD" && (
                    <div className="ml-auto">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
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
                          {selectedCurrency === "XOF"
                            ? cart.price -
                              (cart.discount
                                ? (cart.price * cart.discount) / 100
                                : 0)
                            : Number(
                                (cart.price -
                                  (cart.discount
                                    ? (cart.price * cart.discount) / 100
                                    : 0)) /
                                  usdRate
                              ).toFixed(2)}
                          {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                        </p>
                        <p className="text-xs text-[#A36F5E] line-through">
                          {selectedCurrency === "XOF"
                            ? cart.price
                            : Number(cart.price / usdRate).toFixed(2)}{" "}
                          {selectedCurrency === "XOF" ? "FCFA" : "USD"}
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
                    {selectedCurrency === "XOF"
                      ? Math.round(subTotal)
                      : Number(subTotal / usdRate).toFixed(2)}{" "}
                    {selectedCurrency === "XOF" ? "FCFA" : "USD"}
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
