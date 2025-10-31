import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

/**
 * GET /api/letters
 * Récupérer toutes les lettres
 * Peut filtrer par ville, type de relation, etc.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const relationshipType = searchParams.get("relationshipType");

    // Construire les filtres dynamiquement
    const where: any = {};
    if (city) where.city = city;
    if (relationshipType) where.relationshipType = relationshipType;

    const letters = await prisma.letter.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(letters);
  } catch (error) {
    console.error("[API Letters GET] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des lettres" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/letters
 * Créer une nouvelle lettre
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, city, relationshipType } = body;

    // Validation
    if (!content || !city || !relationshipType) {
      return NextResponse.json(
        { error: "Données manquantes (content, city, relationshipType requis)" },
        { status: 400 }
      );
    }

    // Vérifier que relationshipType est valide
    const validTypes = ["amoureuse", "amicale", "familiale"];
    if (!validTypes.includes(relationshipType)) {
      return NextResponse.json(
        { error: "Type de relation invalide" },
        { status: 400 }
      );
    }

    // Créer la lettre avec Prisma
    const newLetter = await prisma.letter.create({
      data: {
        content,
        city,
        relationshipType,
      },
    });

    console.log("[API Letters POST] Nouvelle lettre créée:", newLetter.id);

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error) {
    console.error("[API Letters POST] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la lettre" },
      { status: 500 }
    );
  }
}
