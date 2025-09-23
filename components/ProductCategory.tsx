"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/lib/models/product";
import { categories } from "@/lib/sampledata";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCategory = ({ category }: { category: string }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const categoryData = categories.find((cat) => cat.slug === category);
  const { addToCart } = useStore();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${category}`);
        const data = await response.json();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const handleAddToCart = (product: IProduct) => {
    const newProduct = { ...product, quantity: 1, id: product._id as string };
    addToCart(newProduct);
    toast.success("Produit ajouté au panier", {
      duration: 3000,
      style: {
        color: "#10b981",
      },
      position: "top-right",
    });
  };

  return (
    <div className="w-full flex flex-col items-start py-10 mx-auto max-w-7xl font-josefin px-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-black mb-4">
        {categoryData?.title}
      </h1>
      {categoryData?.subcategories && (
        <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-16 my-6">
          {categoryData?.subcategories?.map((subcategory) => (
            <span
              key={subcategory.id}
              className="text-black uppercase border-b border-gray-200 pb-2"
            >
              {subcategory.title}
            </span>
          ))}
        </div>
      )}

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mb-6">
        
        {
          loading ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-72 h-64 bg-gray-200 animate-pulse rounded-md">
                  <Skeleton className="w-72 h-64" />
                  <Skeleton className="w-72 h-4" />
                  <Skeleton className="w-72 h-4" />
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          )) : (
        products.map((product) => (
          <Link
            href={`/${category}/${product.subCategory}`}
            key={product.id}
            className="flex flex-col h-full"
          >
            {/* Contenu principal avec flex-1 pour occuper l'espace disponible */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={220}
                height={220}
                className="w-72 h-64 object-cover object-center"
              />
              <p className="text-black text-sm font-josefin text-center">
                {product.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#A36F5E] line-through text-xl font-josefin font-medium">
                  {product.price}
                </span>
                <span className="text-[#262626] text-xl font-josefin font-medium">
                  {product.discount && product.discount > 0 && (
                    <span className="ml-2">
                      {Math.round(
                        product.price - (product.price * product.discount) / 100
                      )}{" "}
                      FCFA
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
                className="bg-[#A36F5E] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-josefin font-medium w-full transition-all duration-300 hover:bg-[#916253]"
              >
                Ajouter au panier
              </button>
            </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
