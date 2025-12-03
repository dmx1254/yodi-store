import Currency from "@/lib/models/currency";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

await connectDB();

export async function GET() {
  try {
    const currency = await Currency.findOne().select("_id name rate");
    return NextResponse.json(currency, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la devise:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la devise" },
      { status: 500 }
    );
  }
}
