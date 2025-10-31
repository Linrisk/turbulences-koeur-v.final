import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import crypto from "crypto";

async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(password + "turbulences_salt");
  return hash.digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== user.passwordHash) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    // Mettre à jour le mot de passe
    const newHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    console.log("[API Change Password] Mot de passe modifié pour:", userId);

    return NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    console.error("[API Change Password] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors du changement de mot de passe" },
      { status: 500 }
    );
  }
}
