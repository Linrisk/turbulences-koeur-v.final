import prisma from "./prisma/client";
import crypto from "crypto";

async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(password + "turbulences_salt");
  return hash.digest("hex");
}

async function testLogin() {
  console.log("🔐 Test d'authentification directe avec Prisma...\n");

  try {
    // Test 1: Admin login
    console.log("Test 1️⃣ : Login ADMIN");
    console.log("-".repeat(50));
    
    const adminUser = await prisma.adminUser.findUnique({
      where: { login: "admin" },
    });
    
    if (adminUser) {
      const passwordHash = await hashPassword("turbulences2024");
      const isValid = passwordHash === adminUser.passwordHash;
      console.log(`✅ Admin trouvé: ${adminUser.login}`);
      console.log(`✅ Mot de passe correct: ${isValid}`);
      console.log(`ID: ${adminUser.id}\n`);
    } else {
      console.log(`❌ Admin non trouvé\n`);
    }

    // Test 2: Facteur login
    console.log("Test 2️⃣ : Login FACTEUR");
    console.log("-".repeat(50));
    
    const facteurUser = await prisma.adminUser.findUnique({
      where: { login: "facteur" },
    });
    
    if (facteurUser) {
      const passwordHash = await hashPassword("facteur2024");
      const isValid = passwordHash === facteurUser.passwordHash;
      console.log(`✅ Facteur trouvé: ${facteurUser.login}`);
      console.log(`✅ Mot de passe correct: ${isValid}`);
      console.log(`ID: ${facteurUser.id}\n`);
    } else {
      console.log(`❌ Facteur non trouvé\n`);
    }

    // Test 3: Wrong password
    console.log("Test 3️⃣ : Mauvais mot de passe");
    console.log("-".repeat(50));
    
    const wrongHash = await hashPassword("wrongpassword");
    const adminCheck = await prisma.adminUser.findUnique({
      where: { login: "admin" },
    });
    
    if (adminCheck) {
      const isValid = wrongHash === adminCheck.passwordHash;
      console.log(`❌ Mot de passe invalide: ${isValid}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Tests complétés !");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
