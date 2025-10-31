import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.pageContent.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    console.error("[API CMS] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des pages" },
      { status: 500 }
    );
  }
}
