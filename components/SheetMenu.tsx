"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import { categories } from "@/lib/sampledata";
import Link from "next/link";

const SheetMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="visible md:invisible text-[#A36F5E] cursor-pointer transition-all duration-300 hover:scale-110 hover:text-[#916253]">
          <Menu size={36} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="px-4 py-10 font-josefin font-semibold"
      >
        <div className="flex flex-col items-start gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="w-full relative"
            >
              <span>{category.title}</span>
              {category.subcategories && (
                <ChevronRight
                  size={16}
                  className={`absolute transition-all duration-500 right-2 top-[7%] text-[#A36F5E] hover:text-[#916253] ${isOpen ? "rotate-90" : "rotate-0"}`}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                />
              )}
              {category.subcategories && isOpen && (
                <div className="flex flex-col items-start mt-2 gap-2">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/${category.slug}/${subcategory.slug}`}
                      className="text-sm font-normal"
                    >
                      {subcategory.title}
                    </Link>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
