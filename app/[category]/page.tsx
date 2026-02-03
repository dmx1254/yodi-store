import React from "react";
import ProductCategory from "@/components/ProductCategory";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  return (
    <ProductCategory category={category} />
  );
};

export default page;
