import prisma from "./prisma/client";
import crypto from "crypto";

async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(password + "turbulences_salt");
  return hash.digest("hex");
}

async function resetAdminUsers() {
  console.log("🔄 Réinitialisation des comptes admin...\n");

  try {
    // Supprime les anciens comptes
    await prisma.adminUser.deleteMany();
    console.log("✅ Anciens comptes supprimés\n");

    // Hash les mots de passe
    const adminPassword = "turbulences2024";
    const facteurPassword = "facteur2024";

    const adminPasswordHash = await hashPassword(adminPassword);
    const facteurPasswordHash = await hashPassword(facteurPassword);

    // Crée les nouveaux comptes
    const admin = await prisma.adminUser.create({
      data: {
        login: "admin",
        email: "admin@turbulences.fr",
        passwordHash: adminPasswordHash,
        role: "admin",
      },
    });

    const facteur = await prisma.adminUser.create({
      data: {
        login: "facteur",
        email: "facteur@turbulences.fr",
        passwordHash: facteurPasswordHash,
        role: "facteur",
      },
    });

    console.log("📋 COMPTES CRÉÉS AVEC SUCCÈS\n");
    console.log("=" .repeat(50));
    console.log("\n🔐 COMPTE ADMIN");
    console.log("-" .repeat(50));
    console.log(`Login: admin`);
    console.log(`Email: admin@turbulences.fr`);
    console.log(`Mot de passe: ${adminPassword}`);
    console.log(`Hash: ${adminPasswordHash}`);
    console.log(`ID: ${admin.id}`);

    console.log("\n🔐 COMPTE FACTEUR");
    console.log("-" .repeat(50));
    console.log(`Login: facteur`);
    console.log(`Email: facteur@turbulences.fr`);
    console.log(`Mot de passe: ${facteurPassword}`);
    console.log(`Hash: ${facteurPasswordHash}`);
    console.log(`ID: ${facteur.id}`);

    console.log("\n" + "=" .repeat(50));
    console.log("✅ Réinitialisation complétée !\n");
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminUsers();
