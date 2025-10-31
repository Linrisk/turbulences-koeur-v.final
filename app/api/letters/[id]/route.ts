import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

/**
 * GET /api/letters/[id]
 * Récupérer une lettre par ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const letter = await prisma.letter.findUnique({
      where: { id: params.id },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Lettre non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("[API Letters GET by ID] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la lettre" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/letters/[id]
 * Mettre à jour une lettre
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, city, relationshipType } = body;

    const updatedLetter = await prisma.letter.update({
      where: { id: params.id },
      data: {
        ...(content && { content }),
        ...(city && { city }),
        ...(relationshipType && { relationshipType }),
      },
    });

    console.log("[API Letters PUT] Lettre mise à jour:", updatedLetter.id);

    return NextResponse.json(updatedLetter);
  } catch (error) {
    console.error("[API Letters PUT] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la lettre" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/letters/[id]
 * Supprimer une lettre
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.letter.delete({
      where: { id: params.id },
    });

    console.log("[API Letters DELETE] Lettre supprimée:", params.id);

    return NextResponse.json({
      success: true,
      message: "Lettre supprimée avec succès",
    });
  } catch (error) {
    console.error("[API Letters DELETE] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la lettre" },
      { status: 500 }
    );
  }
}
