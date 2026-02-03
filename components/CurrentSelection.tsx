"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { currentSelection } from "@/lib/sampledata";

const CurrentSelection = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center gap-4 md:py-10 py-4 px-4 lg:px-20">
      <h2 className="text-4xl font-bold font-josefin text-center text-[#A36F5E] mb-24 mt-4">
        Découvrez notre sélection du moment
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-32 md:gap-8 lg:gap-16">
        {currentSelection.map((product) => (
          <div
            key={product.id}
            className="w-fullflex flex-col items-center gap-4 relative group"
          >
            {/* Titre en haut */}
            <div
              style={{
                border: "1px solid #A36F5E",
              }}
              className="w-full max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)] absolute -top-6 left-1/2 -translate-x-1/2 z-10 bg-white/80 px-4 py-3 rounded-md"
            >
              <h3 className="text-xs text-center font-josefin uppercase text-[#A36F5E]">
                {product.category.replace("-", " ").toUpperCase()}
              </h3>
            </div>

            {/* Image du produit avec overlay */}
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <Image
                src={product.productImage}
                alt={product.title}
                width={300}
                height={240}
                className="w-full h-full object-cover object-center"
              />

              {/* Overlay qui commence en bas et remonte au hover */}
              {/* <div className="absolute bottom-0 left-0 w-full h-full opacity-100 translate-y-full transition-all duration-700 group-hover:translate-y-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-josefin font-medium text-center px-4">
                  {product.title}
                </span>
              </div> */}
            </div>

            <div
              style={{
                border: "1px solid #A36F5E",
              }}
              className="w-full max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)] absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/60 px-4 py-3 rounded-md"
            >
              <p className="text-sm text-center font-josefin text-[#A36F5E] pb-6">
                {product.description}
              </p>
              <Link
                className={`absolute -bottom-6 text-xs left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-80px)] sm:max-w-[calc(100%-160px)] p-3 rounded-md text-center font-josefin font-medium transition-colors duration-300 ${product.isActive ? "bg-[#A36F5E] text-white hover:bg-[#916253]" : "bg-gray-100 border-none text-black/90"}`}
                href={`/${product.category}`}
              >
                Voir les produits
              </Link>
            </div>

            {/*             
            <p className="text-gray-700 text-center text-sm font-josefin px-4">
              {product.description}
            </p>

         
            <Link
              href={`/${product.category}`}
              className={`w-full py-3 px-6 rounded-md text-center font-josefin font-medium transition-colors duration-300 ${
                product.isActive
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              Voir les produits
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentSelection;
