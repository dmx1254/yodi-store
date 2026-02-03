import React from "react";
import ProductSubcategory from "@/components/ProductSubcategory";

const page = async ({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) => {
  const { category, subcategory } = await params;

  return <ProductSubcategory category={category} subcategory={subcategory} />;
};

export default page;
