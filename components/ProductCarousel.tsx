"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// 🚀 SSR OPTIMIZATION: Props interface for server-fetched data
// ============================================
interface ProductCarouselProps {
    initialProducts: IProduct[];
}

const ProductCarousel = ({ initialProducts }: ProductCarouselProps) => {
    // Products come from server - no client fetch needed
    const [products] = useState<IProduct[]>(initialProducts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const { addToCart, selectedCurrency, usdRate } = useStore();

    // Nombre de cartes visibles selon la taille d'écran
    const [visibleCards, setVisibleCards] = useState(4);

    // Responsive: detect screen size (optimisé avec debounce implicite)
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleCards(1);
            } else if (width < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(4);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-play (pause on hover)
    useEffect(() => {
        if (isPaused || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.max(0, products.length - visibleCards);
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused, products.length, visibleCards]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? Math.max(0, products.length - visibleCards) : prev - 1));
    }, [products.length, visibleCards]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, products.length - visibleCards);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [products.length, visibleCards]);

    const handleAddToCart = useCallback((product: IProduct) => {
        const newProduct = { ...product, quantity: 1, id: product._id as string };
        addToCart(newProduct);

        // Meta Pixel tracking
        const finalPrice = product.discount
            ? product.price - (product.price * product.discount) / 100
            : product.price;
        const eventId = trackAddToCart({
            id: product._id as string,
            name: product.title,
            price: finalPrice,
            quantity: 1,
            currency: selectedCurrency,
        });

        sendToCAPI("AddToCart", {
            content_ids: [product._id as string],
            content_name: product.title,
            content_type: "product",
            value: finalPrice,
            currency: selectedCurrency,
            num_items: 1,
        }, eventId);

        toast.success("Produit ajouté au panier", {
            duration: 3000,
            style: { color: "#10b981" },
            position: "top-right",
        });
    }, [addToCart, selectedCurrency]);

    // ============================================
    // 🚀 OPTIMIZATION 3: Calcul mémorisé des indices visibles
    // ============================================
    const visibleProductIndices = useMemo(() => {
        const indices = new Set<number>();
        // Produits actuellement visibles
        for (let i = currentIndex; i < currentIndex + visibleCards && i < products.length; i++) {
            indices.add(i);
        }
        // Précharger le prochain slide (1 produit de plus)
        if (currentIndex + visibleCards < products.length) {
            indices.add(currentIndex + visibleCards);
        }
        return indices;
    }, [currentIndex, visibleCards, products.length]);

    const maxIndex = Math.max(0, products.length - visibleCards);

    // SSR: No skeleton needed - products are pre-fetched from server
    if (products.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className="w-full max-w-7xl mx-auto px-4 py-12 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Carrousel de nos produits les plus appréciés"
        >
            {/* Titre - rendu immédiat pour LCP */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-josefin text-center text-[#A36F5E] mb-8">
                Nos huiles & soins les plus appréciés
            </h2>

            {/* Carousel Container */}
            <div className="relative">
                {/* Navigation Arrows */}
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed p-2 md:p-3 rounded-full shadow-lg transition-all duration-300"
                    aria-label="Produits précédents"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#A36F5E]" />
                </button>

                <button
                    onClick={goToNext}
                    disabled={currentIndex >= maxIndex}
                    className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed p-2 md:p-3 rounded-full shadow-lg transition-all duration-300"
                    aria-label="Produits suivants"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#A36F5E]" />
                </button>

                {/* Carousel Track - GPU accelerated */}
                <div className="overflow-hidden px-2">
                    <div
                        ref={carouselRef}
                        className="flex will-change-transform"
                        style={{
                            transform: `translate3d(-${currentIndex * (100 / visibleCards)}%, 0, 0)`,
                            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        {products.map((product, index) => {
                            const productUrl = product.subCategory
                                ? `/${product.category}/${product.subCategory}`
                                : `/${product.category}/product/${product._id}`;

                            const finalPrice = product.discount && product.discount > 0
                                ? product.price - (product.price * product.discount) / 100
                                : product.price;

                            // 🚀 OPTIMIZATION 5: Priority loading pour les premiers slides
                            const isPriorityImage = index < visibleCards;
                            const isInViewport = visibleProductIndices.has(index);

                            return (
                                <article
                                    key={String(product._id)}
                                    className="flex-shrink-0 px-2 md:px-3 group"
                                    style={{ width: `${100 / visibleCards}%` }}
                                >
                                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                                        {/* Zone cliquable: Image + Infos */}
                                        <Link
                                            href={productUrl}
                                            className="flex-1 flex flex-col"
                                            prefetch={isPriorityImage} // Prefetch uniquement les premiers
                                        >
                                            {/* Image - Optimisée */}
                                            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    // 🚀 OPTIMIZATION 6: Priority pour LCP, lazy pour le reste
                                                    priority={isPriorityImage}
                                                    loading={isPriorityImage ? undefined : "lazy"}
                                                    // Placeholder blur pour meilleur CLS
                                                    placeholder="blur"
                                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                                                    // Désactiver le décodage pour les images non visibles
                                                    decoding={isInViewport ? "async" : "async"}
                                                />
                                                {product.discount && product.discount > 0 && (
                                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                                                        -{product.discount}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-josefin font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-[#A36F5E] transition-colors">
                                                    {product.title}
                                                </h3>

                                                {/* Prix */}
                                                <div className="flex items-center gap-2 mt-auto">
                                                    {product.discount && product.discount > 0 && (
                                                        <span className="text-gray-400 line-through text-sm font-josefin">
                                                            {selectedCurrency === "XOF"
                                                                ? product.price
                                                                : Number(product.price / Number(usdRate || 1)).toFixed(2)
                                                            } {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                                                        </span>
                                                    )}
                                                    <span className="text-[#A36F5E] font-bold text-lg font-josefin">
                                                        {selectedCurrency === "XOF"
                                                            ? Math.round(finalPrice)
                                                            : Number(finalPrice / Number(usdRate || 1)).toFixed(2)
                                                        } {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Bouton Ajouter au panier */}
                                        <div className="px-4 pb-4">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-[#A36F5E] hover:bg-[#916253] text-white font-josefin font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 text-sm"
                                            >
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dots Indicator - optimisé */}
            {maxIndex > 0 && (
                <nav className="flex justify-center gap-2 mt-6" aria-label="Navigation du carrousel">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-[#A36F5E] w-6"
                                : "bg-gray-300 hover:bg-gray-400 w-2.5"
                                }`}
                            aria-label={`Aller à la page ${index + 1}`}
                            aria-current={index === currentIndex ? "true" : undefined}
                        />
                    ))}
                </nav>
            )}
        </section>
    );
};

export default ProductCarousel;
