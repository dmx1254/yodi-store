import { NextResponse } from "next/server";
import ProductModel from "@/lib/models/product";

export async function GET(
  req: Request,
  { params }: { params: { productid: string } }
) {
  const { productid } = await params;

  try {
    const product = await ProductModel.findById(productid);
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}
