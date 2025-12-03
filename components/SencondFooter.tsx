"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaShippingFast,
  FaCreditCard,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const SencondFooter = () => {
  return (
    <footer className="w-full bg-gray-100 mt-44">
      {/* Section supérieure - Services */}
      <div className="w-full bg-gray-50 py-8 px-4 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Livraison */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#A36F5E] rounded-full flex items-center justify-center">
              <FaShippingFast className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E]">
                Livraison
              </h3>
              <p className="text-sm text-gray-600 font-josefin">
                En moins de 24h sur Dakar
              </p>
            </div>
          </div>

          {/* Authenticité */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#A36F5E] rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E]">
                Authenticité Garantie
              </h3>
              <p className="text-sm text-gray-600 font-josefin">
                Produits de bonne qualité
              </p>
            </div>
          </div>

          {/* Paiement */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#A36F5E] rounded-full flex items-center justify-center">
              <FaCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E]">
                Paiement au choix
              </h3>
              <p className="text-sm text-gray-600 font-josefin">
                Espèces - Orange Money - Wave - Carte bancaire
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section inférieure - Navigation et contact */}
      <div className="w-full bg-gray-100 py-12 px-4 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo et Contact */}
            <div className="">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <Image
                    src="/logo.png"
                    alt="Yodi-store"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-josefin">
                  yodistores@gmail.com
                </p>
                <a
                  href="tel:+221789689698"
                  className="text-sm text-gray-600 font-josefin"
                >
                 S/N +221 78 968 96 98
                </a>
                
                <br />
                <a
                  href="tel:+18192908365"
                  className="text-sm text-gray-600 font-josefin"
                >
                 C/N +1 81 9 2 908365
                </a>
                <br />
                <a
                  href="tel:+18192908365"
                  className="text-sm text-gray-600 font-josefin"
                >
                 Num. commercial : +221 78 012 84 86
                </a>
              </div>
            </div>

            {/* Catégories */}
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E] mb-4">
                Catégories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tisane/detox"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Tisane Detox
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tisane/digestive"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Tisane Digestive
                  </Link>
                </li>
                <li>
                  <Link
                    href="/huile/huile-barbe"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Huile à Barbe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/savon"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Savon
                  </Link>
                </li>
              </ul>
            </div>

            {/* Informations pratiques */}
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E] mb-4">
                Informations pratiques
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/profile"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Mon compte
                  </Link>
                </li>

                <li>
                  <Link
                    href="/condition-dutilisations"
                    className="text-sm text-gray-600 font-semibold hover:text-[#A36F5E] font-josefin"
                  >
                    Conditions d&apos;utilisation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Suivez-nous */}
            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E] mb-4">
                Suivez-nous
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/yodi.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#A36F5E] rounded-full flex items-center justify-center hover:bg-[#916253] transition-colors"
                >
                  <FaFacebook className="w-5 h-5 text-blue-600" />
                </a>
                <a
                  href="https://www.instagram.com/yodi_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#A36F5E] rounded-full flex items-center justify-center hover:bg-[#916253] transition-colors"
                >
                  <FaInstagram className="w-5 h-5 text-pink-500" />
                </a>
                <a
                  href="https://wa.me/221789689698"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#A36F5E] rounded-full flex items-center justify-center hover:bg-[#916253] transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                </a>
                <a
                  href="https://x.com/yodi_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#A36F5E] rounded-full flex items-center justify-center hover:bg-[#916253] transition-colors"
                >
                  <FaXTwitter className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-josefin font-semibold text-[#A36F5E] mb-4">
                Paiement sécurisé
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                  <Image
                    src="/wave.png"
                    alt="Wave"
                    width={156}
                    height={156}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <Image
                    src="/orange-money.png"
                    alt="Orange Money"
                    width={132}
                    height={132}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SencondFooter;
