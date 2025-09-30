import ProductModel from "@/lib/models/product";
import { NextResponse } from "next/server";

interface FilterType {
  category: string;
  $or?: Array<{ subCategory: string | RegExp }>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");

  if (!category) {
    return NextResponse.json({ message: "Catégorie requise" }, { status: 400 });
  }

  try {
    // Construction du filtre
    const filter: FilterType = { category };
    if (subCategory) {
      // Essayer plusieurs correspondances possibles pour la sous-catégorie
      filter.$or = [
        { subCategory: subCategory },
        { subCategory: new RegExp(subCategory, 'i') },
        { subCategory: new RegExp(subCategory.replace('-', ' '), 'i') },
        { subCategory: new RegExp(subCategory.replace(' ', '-'), 'i') }
      ];
    }

    // console.log("Database filter:", JSON.stringify(filter, null, 2));

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Récupération des produits avec pagination
    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Compter le total pour la pagination
    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // console.log(`Found ${products.length} products out of ${total} total for category: ${category}, subCategory: ${subCategory}`);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
