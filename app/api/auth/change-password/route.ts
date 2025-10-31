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
    const { adminId, currentPassword, newPassword } = body;

    if (!adminId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminUser = await prisma.adminUser.findUnique({ where: { id: adminId } });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isValidPassword = await verifyPassword(currentPassword, adminUser.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: adminId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all sessions
    await prisma.adminSession.deleteMany({ where: { adminId } });

    return NextResponse.json({ success: true, message: "Mot de passe changé avec succès" });
  } catch (error) {
    console.error("[API] Password change error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du changement de mot de passe" },
      { status: 500 }
    );
  }
}
