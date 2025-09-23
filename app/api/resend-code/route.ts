import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationModel from "@/lib/models/verification";
import RegisterTemplate from "@/components/registerTemplate";

const resend = new Resend(process.env.RESEND_API_KEY) || "re_9W11UDRG_AHiyyuWSdbuNyhEUCbgBbQgk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier s'il existe un code de vérification en attente
    const existingVerification = await VerificationModel.findOne({ email });

    if (!existingVerification) {
      return NextResponse.json(
        { message: "Aucun code de vérification trouvé pour cet email" },
        { status: 400 }
      );
    }

    // Générer un nouveau code de vérification
    const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mettre à jour le code et la date d'expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Expire dans 30 minutes

    await VerificationModel.updateOne(
      { email },
      {
        code: newVerificationCode,
        expiresAt,
        createdAt: new Date()
      }
    );

    // Envoyer le nouveau code par email
    try {
      await resend.emails.send({
        from: "Yodi Cosmetics <noreply@ibendouma.com>",
        to: [email],
        subject: "Nouveau code de vérification - Yodi Cosmetics",
        react: await RegisterTemplate({
          firstname: existingVerification.userData.firstname,
          verificationCode: newVerificationCode,
        }),
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // Ne pas faire échouer la requête si l'email ne peut pas être envoyé
    }

    return NextResponse.json(
      { 
        message: "Un nouveau code de vérification a été envoyé à votre email"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur renvoi code:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
