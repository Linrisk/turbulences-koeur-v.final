import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import crypto from "crypto";

async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(password + "turbulences_salt");
  return hash.digest("hex");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { login, password } = body;

    console.log("[API] Login attempt for:", login);

    if (!login || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const adminUser = await prisma.adminUser.findUnique({ where: { login } });

    if (!adminUser) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, adminUser.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 });
    }

    console.log("[API] Login successful for:", login);

    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        login: adminUser.login,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("[API] Login error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}
