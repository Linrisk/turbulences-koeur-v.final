import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Import dynamique de Prisma seulement au runtime
    const prisma = (await import("@/prisma/client")).default;
    const crypto = await import("crypto");

    const body = await request.json();
    const { login, password } = body;

    if (!login || !password) {
      return NextResponse.json(
        { success: false, error: "Identifiants manquants" },
        { status: 400 }
      );
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { login },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 401 }
      );
    }

    // Hash password
    const passwordHash = crypto
      .createHash("sha256")
      .update(password + "turbulences_salt")
      .digest("hex");

    if (passwordHash !== adminUser.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: crypto.randomUUID(),
      user: {
        id: adminUser.id,
        login: adminUser.login,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("[API Login] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}
