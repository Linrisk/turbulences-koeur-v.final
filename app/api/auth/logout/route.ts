import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Déconnexion de l'utilisateur
 * Le token est supprimé côté client dans localStorage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log("[API Logout] Déconnexion demandée pour userId:", userId);

    // Côté serveur, il n'y a rien à faire puisque le token est stocké en localStorage
    // On peut juste logger la déconnexion pour les statistiques si besoin

    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("[API Logout] Erreur lors de la déconnexion:", error);

    // Même en cas d'erreur, on retourne success:true
    // car la suppression du localStorage se fera côté client
    return NextResponse.json({
      success: true,
      message: "Déconnexion traitée (localStorage à nettoyer côté client)",
    });
  }
}

/**
 * DELETE /api/auth/logout
 * Alternative pour déconnexion via DELETE
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log("[API Logout] Déconnexion (DELETE)");

    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("[API Logout] Erreur:", error);

    return NextResponse.json({
      success: true,
      message: "Déconnexion traitée",
    });
  }
}
