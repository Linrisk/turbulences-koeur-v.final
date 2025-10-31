import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const session = await prisma.adminSession.findUnique({
      where: { sessionToken },
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true, adminId: session.adminId });
  } catch (error) {
    console.error("[API] Validation error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
