import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Vérifie la session existante
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: "Token manquant" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      message: "Token valide",
    });
  } catch (error) {
    console.error("[API Session] Erreur GET:", error);
    return NextResponse.json(
      { authenticated: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Crée une session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "UserId manquant" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, login: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("[API Session] Erreur POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Supprime la session
export async function DELETE() {
  try {
    return NextResponse.json({
      success: true,
      message: "Session supprimée côté client",
    });
  } catch (error) {
    console.error("[API Session] Erreur DELETE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ⚠️ Ajoute ces lignes en bas — elles forcent le mode dynamique
// (indispensable quand tu utilises Prisma + App Router)
export const dynamic = "force-dynamic";
export const revalidate = 0;
