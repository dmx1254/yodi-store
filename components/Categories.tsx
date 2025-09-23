import { catImages } from "@/lib/sampledata";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center gap-4 md:py-10 py-4 px-4 lg:px-20">
      <h2 className="text-4xl font-bold font-josefin text-center text-[#A36F5E] mb-8 mt-4 md:mb-24 md:mt-16">
        {" "}
        Yodi Cosmetics <br /> Parapharmacie en ligne{" "}
        <span className="font-playfair">&</span> Cosmétiques
      </h2>

      <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
        {catImages.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.slug}`}
            className="flex flex-col items-center justify-center gap-4 relative group overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              width={240}
              height={240}
              className="w-full h-full object-cover object-center bg-black"
            />
            <span className="absolute top-0 left-0 bg-white/40 p-2 transition-all duration-300 group-hover:bg-white/70 text-black text-sm font-josefin font-medium">
              {cat.title}
            </span>
            <div className="absolute bottom-0 left-0 w-full origin-bottom opacity-0 h-full translate-y-full transition-transform duration-700 group-hover:opacity-100 group-hover:translate-y-0 bg-black/20">
            <span className="text-white text-2xl font-josefin font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {cat.title}
            </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
