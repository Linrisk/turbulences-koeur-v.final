import prisma from "./prisma/client";

async function testConnection() {
  try {
    console.log("🔍 Test de connexion Prisma...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Défini" : "❌ Non défini");

    // Teste la connexion
    const result = await prisma.$executeRawUnsafe("SELECT NOW()");
    console.log("✅ Connexion Neon OK");

    // Compte les lettres
    const count = await prisma.letter.count();
    console.log("📊 Lettres dans Neon:", count);

    // Récupère les lettres
    const letters = await prisma.letter.findMany();
    console.log("✅ Lettres récupérées:", letters.length);
    
    if (letters.length > 0) {
      console.log("📝 Première lettre:", letters[0]);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
