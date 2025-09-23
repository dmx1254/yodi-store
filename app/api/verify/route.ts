import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/lib/models/user";
import VerificationModel from "@/lib/models/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validation des champs requis
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email et code de vérification requis" },
        { status: 400 }
      );
    }

    // Vérifier le code de vérification
    const verification = await VerificationModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() } // Vérifier que le code n'a pas expiré
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Code de vérification invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // Supprimer le code de vérification utilisé
      await VerificationModel.deleteOne({ _id: verification._id });
      return NextResponse.json(
        { message: "Ce compte est déjà vérifié" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur avec les données sauvegardées
    const newUser = new UserModel(verification.userData);
    await newUser.save();

    // Supprimer le code de vérification utilisé
    await VerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json(
      { 
        message: "Compte vérifié avec succès",
        user: {
          id: newUser._id,
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur vérification:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
