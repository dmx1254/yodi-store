import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/lib/models/order";
import { options } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

await connectDB();

export async function POST(req: Request) {
  const isAuth = await getServerSession(options);
  if (!isAuth) {
    return NextResponse.json(
      { message: "Vous devez être connecté pour confirmer votre commande" },
      { status: 401 }
    );
  }
  const data = await req.json();

  //   console.log(data);

  try {
    await OrderModel.create({ ...data.orderData, userId: isAuth?.user?.id });
    return NextResponse.json(
      { message: "Commande créée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
