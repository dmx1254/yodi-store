"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useRef } from "react";
import { CART } from "@/lib/types/types";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { addToCart } = useStore();
  const { productname } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showModal, setShowModal] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Simuler un produit (remplacez par la vraie logique de récupération)
  const product = {
    id: "hgushyk",
    title: "Topicrem Mela Lait Unifiant Ultra-Hydratant Spf15 500ml",
    price: 2700,
    discount: 20,
    imageUrl: "/products/timex.jpg",
    category: "Soins du visage",
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l'apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
      "Peaux sensibles - Taches",
      "Hydrate 24H",
    ],
    stock: 10,
    brand: "TOPICREM",
    sku: "14526",
    etiquette: "TOPICREM MELA",
    description:
      "Le Topicrem Mela Lait Unifiant Ultra-Hydratant est un soin innovant qui unifie le teint tout en corrigeant et prévenant l'apparition des taches. Sa formule enrichie en actifs éclaircissants et hydratants offre une protection SPF15 contre les rayons UVA/UVB.",
    usage:
      "Appliquez le produit sur le visage et le cou le matin et le soir après nettoyage. Utilisez en complément de votre routine de soins habituelle.",
    quantity: 1,
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (product: CART) => {
    const newProduct = { ...product, quantity: quantity };
    addToCart(newProduct);
    toast.success("Produit ajouté au panier");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMagnifierPos({ x, y });
  };

  return (
    <>
      <div className="min-h-screen bg-white py-8 px-4 font-josefin">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-600 mb-6 flex items-end justify-end">
            Accueil / Soins du visage / {product.title}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Colonne gauche - Image du produit (40%) */}
            <div className="lg:col-span-2 relative">
              {/* Image principale avec effet de loupe */}
              <div 
                ref={imageRef}
                className="relative cursor-zoom-in"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={500}
                  height={600}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/500x600/f0f0f0/666?text=Topicrem+Mela";
                  }}
                />

                {/* Effet de loupe */}
                {showMagnifier && (
                  <div 
                    className="absolute pointer-events-none w-32 h-32 border-2 border-white rounded-full overflow-hidden shadow-lg z-20"
                    style={{
                      left: magnifierPos.x,
                      top: magnifierPos.y,
                    }}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      style={{
                        transform: `scale(2) translate(${-magnifierPos.x - 64}px, ${-magnifierPos.y - 64}px)`,
                      }}
                    />
                  </div>
                )}

                {/* Icône de recherche */}
                <button 
                  onClick={() => setShowModal(true)}
                  className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Colonne droite - Détails du produit (60%) */}
            <div className="lg:col-span-3 space-y-1">
              {/* Titre du produit */}
              <h1 className="text-2xl lg:text-3xl font-bold text-black leading-tight">
                {product.title}
              </h1>

              {/* Prix */}
              <div className="flex items-center gap-4">
                <span className="text-[#A36F5E] line-through text-lg font-medium">
                  {product.price}
                </span>
                {product.discount && (
                  <span className="text-[#A36F5E] text-2xl font-bold">
                    {Math.round(product.price - (product.price * product.discount / 100))} FCFA
                  </span>
                )}
              </div>

              {/* Avantages/Bénéfices */}
              {product.benefits && (
                <div className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-700 text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock */}
              {product.stock > 0 && (
                <div className="text-[#A36F5E] font-medium text-xs mt-4">
                  En stock
                </div>
              )}

              {/* Sélecteur de quantité */}
              <div className="flex md:flex-row flex-col items-start md:items-center gap-4">
                <span className="text-gray-700 font-medium">Quantité:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-2 hover:opacity-80 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-2 hover:opacity-80 transition-colors"
                  >
                    +
                  </button>
                </div>
                {/* Bouton Ajouter au panier */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#A36F5E] cursor-pointer text-center hover:bg-[#916253] text-white p-3 rounded-md font-semibold text-sm transition-colors"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Informations de la marque */}
              <div className="text-gray-700 my-4">
                <span className="font-medium text-xs">Marque: </span>
                <a href="#" className="text-[#A36F5E] underline text-sm">
                  {product.brand}
                </a>
              </div>

              {/* Information de livraison */}
              <div className="border inline-flex flex-col items-start gap-2 p-2 my-2">
                <p className="font-bold text-xs">
                  LIVRAISON EN MOINS DE 24H À DAKAR
                </p>
                <p className="text-xs">sauf les dimanches et jours fériés !!</p>
              </div>

              {/* SKU et étiquette */}
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                {product.sku && (
                  <p className="text-[#A36F5E]">SKU : {product.sku}</p>
                )}
                {product.etiquette && (
                  <p className="text-gray-600 text-xs">
                    Étiquette: {product.etiquette}
                  </p>
                )}
              </div>

              {/* Onglets d'information */}
              <div className="border-b border-gray-200 mt-12 mb-8">
                <div className="flex md:flex-row flex-col items-start md:items-center gap-4">
                  {[
                    { id: "description", label: "DESCRIPTION:" },
                    { id: "usage", label: "MODE D'UTILISATION" },
                    { id: "delivery", label: "LIVRAISON" },
                    { id: "howToOrder", label: "COMMENT COMMANDER ?" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 text-xs font-semibold transition-colors ${
                        activeTab === tab.id
                          ? "border-[#A36F5E] border-b-2 text-[#A36F5E] font-medium"
                          : "border-transparent text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu des onglets */}
              <div className="min-h-[200px]">
                {activeTab === "description" && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Description :</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === "usage" && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">
                      Mode d&apos;utilisation :
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {product.usage}
                    </p>
                  </div>
                )}

                {activeTab === "delivery" && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Livraison :</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Livraison en moins de 24h à Dakar, sauf les dimanches et
                      jours fériés. Livraison gratuite à partir de 50.000 CFA
                      d&apos;achat.
                    </p>
                  </div>
                )}

                {activeTab === "howToOrder" && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">
                      Comment commander ?
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                      1. Ajoutez le produit au panier
                      <br />. Remplissez vos informations de livraison
                      <br />. Choisissez votre moyen de paiement
                      <br />. Confirmez votre commande
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche - Image en plein écran */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-8 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10"
            >
              ✕
            </button>
            
            {/* Image en plein écran */}
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={800}
              height={600}
              className="w-full h-auto object-contain max-h-[90vh]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/800x600/f0f0f0/666?text=Topicrem+Mela";
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
