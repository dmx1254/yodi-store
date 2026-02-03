import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import UserModel from "@/lib/models/user";
import VerificationModel from "@/lib/models/verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, password } = body;

    // Validation des champs requis
    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier le code de récupération
    const verification = await VerificationModel.findOne({
      email,
      code,
      type: 'password_reset',
      expiresAt: { $gt: new Date() } // Vérifier que le code n'a pas expiré
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Code de récupération invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await UserModel.updateOne(
      { email },
      { password: hashedPassword }
    );

    // Supprimer le code de récupération utilisé
    await VerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json(
      { 
        message: "Mot de passe réinitialisé avec succès"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur réinitialisation mot de passe:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
